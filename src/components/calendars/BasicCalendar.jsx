import moment from 'moment';
import Calendar from '../../pages/admin/components/Calendar';

const events = [
  {
    start: moment('2023-09-20T10:00:00').toDate(),
    end: moment('2023-03-22T11:00:00').toDate(),
    title: 'MRI Registration',
  },
  {
    start: moment('2023-09-18T14:00:00').toDate(),
    end: moment('2023-09-19T15:30:00').toDate(),
    title: 'ENT Appointment',
  },
];

export default function BasicCalendar() {
  return <Calendar events={events} />;
}
