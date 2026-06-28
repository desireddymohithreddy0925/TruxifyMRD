#!/bin/bash
set -e

# Repository variables
UPSTREAM_REPO="KanishJebaMathewM/Truxify"
HEAD_USER="RishiByte"

# 1. feature/driver-statement
echo "Creating issue 1..."
ISSUE_1_URL=$(gh issue create --repo "$UPSTREAM_REPO" \
  --title "feat: add driver statement and earnings report endpoint" \
  --body "As a driver, I want to retrieve my statement and earnings report. This endpoint should aggregate totals like base freight, platform fees, toll estimates, and net earnings over a specified date range." \
  --label "backend" \
  --label "enhancement")
echo "Created: $ISSUE_1_URL"
ISSUE_1_NUM=$(echo "$ISSUE_1_URL" | grep -oE '[0-9]+$')

echo "Creating PR 1..."
gh pr create --repo "$UPSTREAM_REPO" \
  --head "${HEAD_USER}:feature/driver-statement" \
  --base "main" \
  --title "feat: add driver statement and earnings report endpoint (#${ISSUE_1_NUM})" \
  --body "Resolves #${ISSUE_1_NUM}. Adds GET /api/profile/driver/statement with validation, role checks, and database query."

# 2. feature/support-categories
echo "Creating issue 2..."
ISSUE_2_URL=$(gh issue create --repo "$UPSTREAM_REPO" \
  --title "feat: add GET /api/support/categories endpoint" \
  --body "Add a public endpoint to retrieve valid/accepted support ticket categories. This will allow onboarding screens and mobile apps to dynamically fetch category listings." \
  --label "backend" \
  --label "enhancement")
echo "Created: $ISSUE_2_URL"
ISSUE_2_NUM=$(echo "$ISSUE_2_URL" | grep -oE '[0-9]+$')

echo "Creating PR 2..."
gh pr create --repo "$UPSTREAM_REPO" \
  --head "${HEAD_USER}:feature/support-categories" \
  --base "main" \
  --title "feat: add GET /api/support/categories endpoint (#${ISSUE_2_NUM})" \
  --body "Resolves #${ISSUE_2_NUM}. Exposes public categories endpoint and consolidates category mapping logic."

# 3. feature/support-ticket-comments
echo "Creating issue 3..."
ISSUE_3_URL=$(gh issue create --repo "$UPSTREAM_REPO" \
  --title "feat: add support ticket replies/comments system" \
  --body "Allow customers, drivers (owners of the ticket) and admins to add and list replies/comments on support tickets." \
  --label "backend" \
  --label "enhancement")
echo "Created: $ISSUE_3_URL"
ISSUE_3_NUM=$(echo "$ISSUE_3_URL" | grep -oE '[0-9]+$')

echo "Creating PR 3..."
gh pr create --repo "$UPSTREAM_REPO" \
  --head "${HEAD_USER}:feature/support-ticket-comments" \
  --base "main" \
  --title "feat: add support ticket replies/comments system (#${ISSUE_3_NUM})" \
  --body "Resolves #${ISSUE_3_NUM}. Implements POST/GET support ticket comments with authentication and access controls."

# 4. feature/trip-events-retrieval
echo "Creating issue 4..."
ISSUE_4_URL=$(gh issue create --repo "$UPSTREAM_REPO" \
  --title "feat: add GET /api/trips/:id/events trip event history endpoint" \
  --body "Add an endpoint to retrieve the complete history of telemetry and milestone events for a given trip, sorted chronologically, with access control for driver, customer, and admin roles." \
  --label "backend" \
  --label "enhancement")
echo "Created: $ISSUE_4_URL"
ISSUE_4_NUM=$(echo "$ISSUE_4_URL" | grep -oE '[0-9]+$')

echo "Creating PR 4..."
gh pr create --repo "$UPSTREAM_REPO" \
  --head "${HEAD_USER}:feature/trip-events-retrieval" \
  --base "main" \
  --title "feat: add GET /api/trips/:id/events trip event history endpoint (#${ISSUE_4_NUM})" \
  --body "Resolves #${ISSUE_4_NUM}. Implements trip event history retrieval with query type filters and role-based checks."

# 5. feature/truck-management
echo "Creating issue 5..."
ISSUE_5_URL=$(gh issue create --repo "$UPSTREAM_REPO" \
  --title "feat: add truck registration and listing endpoints" \
  --body "Implement APIs for drivers to register the trucks they own (POST /api/trucks) and list their registered trucks (GET /api/trucks)." \
  --label "backend" \
  --label "enhancement")
echo "Created: $ISSUE_5_URL"
ISSUE_5_NUM=$(echo "$ISSUE_5_URL" | grep -oE '[0-9]+$')

echo "Creating PR 5..."
gh pr create --repo "$UPSTREAM_REPO" \
  --head "${HEAD_USER}:feature/truck-management" \
  --base "main" \
  --title "feat: add truck registration and listing endpoints (#${ISSUE_5_NUM})" \
  --body "Resolves #${ISSUE_5_NUM}. Implements truck registration and listing endpoints for drivers."
