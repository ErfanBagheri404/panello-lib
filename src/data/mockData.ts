import { User, Group, Message } from '../types';

export const users: User[] = [
  {
    id: 1,
    name: "Jason Binoffe",
    pfp: "https://source.unsplash.com/random/40x40?face1",
    online: true,
  },
  {
    id: 2,
    name: "Karthik Jeeva",
    pfp: "https://source.unsplash.com/random/40x40?face2",
    online: false,
  },
  {
    id: 3,
    name: "Samantha Lee",
    pfp: "https://source.unsplash.com/random/40x40?face3",
    online: true,
  },
];

export const groups: Group[] = [
  {
    id: 1,
    name: "Design Team",
    pfp: "https://source.unsplash.com/random/40x40?group1",
    members: [users[0], users[2]],
  },
  {
    id: 2,
    name: "Development Team",
    pfp: "https://source.unsplash.com/random/40x40?group2",
    members: [users[1], users[2]],
  },
];

export const initialMessages: Message[] = [
  {
    sender: "Jason Binoffe",
    text: "Hi, Liki. Is there any update on the filing? I want to get this moving fast.",
    timestamp: "6:33 pm",
    date: "2023-12-10",
  },
  {
    sender: "You",
    text: "Hi Jasper. I will share the estimate today.\n\nWe need to display this while unwrapping the box",
    timestamp: "3:30 pm",
    date: "2023-12-10",
  },
  {
    sender: "Samantha Lee",
    text: "Hey, just checking in on the design progress. Any updates?",
    timestamp: "10:10 am",
    date: "2023-12-12",
  },
  {
    sender: "You",
    text: "Yes, I'll be sending the wireframes soon.",
    timestamp: "10:11 am",
    date: "2023-12-12",
  },
  // Example message with file attachment
  {
    sender: "Karthik Jeeva",
    file: { name: "report.pdf", size: "2.1 MB" },
    timestamp: "2:45 pm",
    date: "2023-12-11",
  },
];