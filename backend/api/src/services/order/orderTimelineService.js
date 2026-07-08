import { DomainError } from './bidAcceptanceService.js';

const DEFAULT_MILESTONES = [
  { milestone: 'Order Placed', completed: true, sort_order: 10 },
  { milestone: 'Truck Assigned', completed: false, sort_order: 20 },
  { milestone: 'En Route to Pickup', completed: false, sort_order: 30 },
  { milestone: 'Arrived at Pickup', completed: false, sort_order: 35 },
  { milestone: 'Goods Loaded', completed: false, sort_order: 40 },
  { milestone: 'In Transit', completed: false, sort_order: 50 },
  { milestone: 'Arriving', completed: false, sort_order: 55 },
  { milestone: 'Delivered', completed: false, sort_order: 60 },
];

export class OrderTimelineService {
  constructor({ supabase, logger }) {
    this.supabase = supabase;
    this.logger = logger;
  }

  async createOrderTimeline(orderDisplayId) {
    const milestones = DEFAULT_MILESTONES.map(m => ({
      order_display_id: orderDisplayId,
      milestone: m.milestone,
      milestone_time: m.completed ? new Date().toISOString() : null,
      completed: m.completed,
      sort_order: m.sort_order,
    }));

    const { error } = await this.supabase.from('order_timeline').insert(milestones);
    if (error) {
      this.logger.error('Timeline Insertion Error:', error.message);
      throw new DomainError(500, { error: 'Failed to create order timeline.', details: error.message });
    }
  }

  async getOrderTimeline(orderDisplayId) {
    const { data: timeline, error } = await this.supabase
      .from('order_timeline')
      .select('milestone, milestone_time, completed, sort_order')
      .eq('order_display_id', orderDisplayId)
      .order('sort_order', { ascending: true });

    if (error) {
      this.logger.error('Timeline Fetch Error:', error.message);
      throw new DomainError(500, { error: 'Failed to fetch order timeline.', details: error.message });
    }

    return timeline || [];
  }

  async completeMilestone(orderDisplayId, milestone, milestoneTime) {
    const time = milestoneTime || new Date().toISOString();
    const { error } = await this.supabase
      .from('order_timeline')
      .update({ completed: true, milestone_time: time })
      .eq('order_display_id', orderDisplayId)
      .eq('milestone', milestone);

    if (error) {
      this.logger.error('Timeline Update Error:', error.message);
      throw new DomainError(500, { error: 'Failed to update order timeline.', details: error.message });
    }
  }

  async resetMilestone(orderDisplayId, milestone) {
    const { error } = await this.supabase
      .from('order_timeline')
      .update({ completed: false, milestone_time: null })
      .eq('order_display_id', orderDisplayId)
      .eq('milestone', milestone);

    if (error) {
      this.logger.error('Timeline Reset Error:', error.message);
    }
  }

  async insertDropChangedEvent(orderDisplayId) {
    const { error } = await this.supabase
      .from('order_timeline')
      .insert({
        order_display_id: orderDisplayId,
        milestone: 'Drop Changed',
        milestone_time: new Date().toISOString(),
        completed: true,
        sort_order: 25,
      });

    if (error) {
      this.logger.warn('Failed to update timeline for change-drop:', error.message);
    }
  }

  async completeOrderPlacedMilestone(orderDisplayId, completedAt) {
    const time = completedAt || new Date().toISOString();
    const { error } = await this.supabase
      .from('order_timeline')
      .update({ completed: true, milestone_time: time })
      .eq('order_display_id', orderDisplayId)
      .eq('milestone', 'Order Placed');

    if (error) {
      this.logger.error('Failed to update Order Placed milestone on cancel:', error.message);
    }
  }

  async deleteOrderTimeline(orderDisplayId) {
    const { error } = await this.supabase
      .from('order_timeline')
      .delete()
      .eq('order_display_id', orderDisplayId);

    if (error) {
      this.logger.error('Failed to delete order timeline:', error.message);
    }
  }
}
