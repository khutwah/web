# Checkpoint Feature Documentation

## Background

Checkpoint is a feature designed to mark a student's status (santri) for various scenarios, such as absence or the process of Lajnah/Assessment.

## Explanation

![checkpoint](./checkpoint.png)

**Ticket:** [GitHub Issue](https://github.com/orgs/khutwah/projects/1?pane=issue&itemId=90160733&issue=khutwah%7Ckhutwah-web%7C159)

### Status Available

```typescript
export const CHECKPOINT_STATUS: CheckpointStatus[] = [
  'lajnah-assessment-approaching',
  'lajnah-assessment-ready',
  'lajnah-assessment-preparation',
  'lajnah-assessment-ongoing',
  'lajnah-assessment-completed',
  'inactive'
]
```

### Status Descriptions

#### lajnah-assessment-approaching

This status is used when a student's Sabaq checkpoint is nearing an assessment checkpoint (e.g., close to completing 5 Juz).

#### lajnah-assessment-ready

This status is used when a student has reached 5 Juz and is ready for assessment.

#### lajnah-assessment-ongoing

This status is used when a student is currently undergoing an assessment.

#### lajnah-assessment-completed

This status is used when a student has finished an assessment. This status is typically marked by the ustadz and may be removed shortly after for historical purposes.

#### inactive

This status is used when a student is unavailable for daily activities due to personal reasons (e.g., illness, family urgency). When a student is marked with this status:

- The `Start Assessment` and `Create Activities` buttons in the santri detail page will be hidden.

### Notes

1. Editing a checkpoint status is only available to the ustadz managing the specific student.
2. The checkpoint status will be displayed below the student's calendar.

## Side Effects

When a checkpoint is created, the following impacts occur:

1. **Inactive Status:**

   - Hides the `Start Assessment` and `Create Activities` buttons in the santri detail page.

2. **Draft Sabaq Automation:**

   - Excludes the student from draft Sabaq automation, meaning no draft activities will be created for that student.

3. **Santri Chart Progress Calculation:**

   - The fields `page_count_accumulation` and `last_activity_id` can be used to calculate the student's page count progress efficiently:
     - Retrieve activities after `last_activity_id`.
     - Iterate through the retrieved activities to sum the `page_count`.
     - Add the sum to `page_count_accumulation` to display progress on the student's chart.

## Summary

This documentation outlines the purpose and behavior of the Checkpoint feature, along with its associated statuses and their implications. Ustadz managing the students are granted the ability to update statuses, which subsequently affect related features like Sabaq automation and activity visibility.
