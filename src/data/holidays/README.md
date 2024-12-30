# Holidays

The holiday data serves as an identifier for various use cases within the application. One key use case is determining whether to generate draft Sabaq Activities for students.

## 1. Public Holiday

Public holiday data is stored in ISO 8601 UTC format to ensure it is timezone-agnostic.

```typescript
type ISODateTimeKey =
  `${number}-${number}-${number}T${number}:${number}:${number}Z`

interface Holidays {
  [key: ISODateTimeKey]: string
}
```

### Example

```typescript
const holidays: Holidays = {
  '2024-12-31T17:00:00Z': 'New Year’s Eve',
  '2025-01-01T17:00:00Z': '2nd day of new year eve'
}
```

### Automation

The public.json file will be automatically generated on December 31st at 10:00 PM Jakarta Time (UTC+7), immediately after the last Sabaq Draft Automation run.
The data is fetched from the following API, which will be configured for the upcoming year:

Admin can update this file to adjust if there is a mistake.

```bash
curl https://api-harilibur.vercel.app/api?year=2025
```

## 2. General Holiday

The general.json file are used for school-specific holidays that fall outside of public holidays. These may include events such as school trips or special occasions when students are not expected to perform Sabaq.

The holiday format is the same as public holidays and follows the ISO 8601 UTC format for timezone-agnostic storage.

Admins can manually update this file as needed.

### Example

```typescript
const holidays: Holidays = {
  '2024-12-31T17:00:00Z': 'New Year’s Eve',
  '2025-01-01T17:00:00Z': '2nd day of new year eve'
}
```

## 3. Student Holiday

For students who schedule their holidays in advance, admins can maintain students.json file.

```typescript
type ISODateTimeKey =
  `${number}-${number}-${number}T${number}:${number}:${number}Z`

interface Holidays {
  [key: ISODateTimeKey]: {
    student_id: number
    reason: string
  }
}
```

### Example

```typescript
const off = {
  student_id: 1,
  reason: 'Family matters'
}
```

## Notes

- **Timezones**:  
  All dates and times must be stored in **ISO 8601 UTC format** to avoid timezone discrepancies.

- **Manual Updates**:  
  Admins can manually update the holiday files (`public.json`, `general.json`, and `student.json`) to correct or add holiday entries.

- **Consistency**:  
  Ensure uniform data formatting across all holiday files.
