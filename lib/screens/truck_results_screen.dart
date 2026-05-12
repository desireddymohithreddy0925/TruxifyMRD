import 'package:flutter/material.dart';

import '../data/mock_data.dart';
import '../models/app_models.dart';
import '../theme/app_theme.dart';
import '../widgets/app_page_route.dart';
import '../widgets/common_widgets.dart';
import 'booking_confirmation_screen.dart';

class TruckResultsScreen extends StatefulWidget {
  const TruckResultsScreen({super.key, required this.draft});

  final RouteDraft draft;

  @override
  State<TruckResultsScreen> createState() => _TruckResultsScreenState();
}

class _TruckResultsScreenState extends State<TruckResultsScreen> {
  int _selectedSort = 0;
  static const _sortChips = ['Best Match', 'Cheapest', 'Fastest', 'Top Rated'];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('12 trucks found'),
        leading: IconButton(onPressed: () => Navigator.of(context).pop(), icon: const Icon(Icons.arrow_back_rounded)),
        actions: [IconButton(onPressed: () {}, icon: const Icon(Icons.sort_rounded))],
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        children: [
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: _sortChips.length,
              separatorBuilder: (_, __) => const SizedBox(width: 10),
              itemBuilder: (context, index) {
                final selected = index == _selectedSort;
                return ChoiceChip(
                  label: Text(_sortChips[index]),
                  selected: selected,
                  onSelected: (_) => setState(() => _selectedSort = index),
                );
              },
            ),
          ),
          const SizedBox(height: 16),
          ...mockTruckResults.asMap().entries.map(
            (entry) {
              final index = entry.key;
              final truck = entry.value;
              return Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: _TruckCard(
                  truck: truck,
                  draft: widget.draft,
                  isHighlighted: index == 0,
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}

class _TruckCard extends StatelessWidget {
  const _TruckCard({required this.truck, required this.draft, required this.isHighlighted});

  final TruckResultData truck;
  final RouteDraft draft;
  final bool isHighlighted;

  @override
  Widget build(BuildContext context) {
    return InfoCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text('${truck.driver}  ⭐ ${truck.rating.toStringAsFixed(1)}', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800)),
              ),
              if (truck.badge != null)
                StatusBadge(label: truck.badge!, color: truck.badgeColor, filled: true),
            ],
          ),
          const SizedBox(height: 10),
          Text('${truck.truck}  |  ${truck.capacity}', style: Theme.of(context).textTheme.bodyMedium?.copyWith(color: FreightFairColors.adaptiveSecondaryText(context))),
          const SizedBox(height: 12),
          Row(
            children: [
              Text('Available space', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: FreightFairColors.adaptiveSecondaryText(context))),
              const Spacer(),
              Text('${truck.freeSpacePercent}% free', style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              minHeight: 10,
              value: truck.freeSpacePercent / 100,
              backgroundColor: FreightFairColors.accentLight,
              valueColor: const AlwaysStoppedAnimation(FreightFairColors.accent),
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(truck.price, style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.w800,
                    color: Theme.of(context).brightness == Brightness.dark
                        ? FreightFairColors.accent
                        : FreightFairColors.accentDark,
                  )),
                  const SizedBox(height: 3),
                  Text('ETA to pickup: ${truck.eta}', style: Theme.of(context).textTheme.bodySmall?.copyWith(color: FreightFairColors.adaptiveSecondaryText(context))),
                ],
              ),
              const Spacer(),
              SizedBox(
                width: 120,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.of(context).push(
                      AppPageRoute(builder: (_) => BookingConfirmationScreen(draft: draft, truck: truck)),
                    );
                  },
                  child: const Text('Book Now'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
