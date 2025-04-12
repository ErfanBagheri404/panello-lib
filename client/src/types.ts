type Language = "en" | "fa";

export interface User {
  id: string;
  name: string;
  pfp: string;
  online: boolean;
  isCurrentUser?: boolean; // Add this optional property
}

export interface Group {
  id: number;
  name: string;
  pfp: string;
  members: User[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  dateAdded: string;
  status: string;
  accountState: string;
  avatar: string;
}

export interface Message {
  sender: string;
  text?: string;
  file?: { name: string; size: string };
  timestamp: string;
  date: string;
}
export interface ITask {
  _id: string;
  title: string;
  subtasks: string[];
  color: string;
  user: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string[]; // Add this property to match the server model
}
export interface LanguageContextType {
  language: Language;
  direction: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
}
export interface UserProviderType {
  userId: string;
  email: string;
  avatar?: string;
}

export interface UserContextType {
  user: UserProviderType | null;
  setUser: React.Dispatch<React.SetStateAction<UserProviderType | null>>;
}
export interface CalendarControlsProps {
  onNavigate: (direction: "prev" | "next" | "today") => void;
}
export interface FilterPopupProps {
  dateRange: { start: Date; end: Date };
  onApply: (start: Date, end: Date) => void;
  onClose: () => void;
}
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color: string;
}

export interface EventModalProps {
  events: CalendarEvent[];
  onAddEvent: (
    event: Omit<CalendarEvent, "id" | "color"> & { sharedWith?: string[] }
  ) => void;
  onEditEvent: (event: CalendarEvent & { sharedWith?: string[] }) => void;
  onDeleteEvent: (eventId: string) => void;
  onClose: () => void;
}

export interface UserOptionsPopupType {
  id: string;
  name: string;
  avatar: string;
}
export interface ViewSwitcherProps {
  currentView: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  onChange: (view: "dayGridMonth" | "timeGridWeek" | "timeGridDay") => void;
}
export interface MembersListProps {
  members: Member[];
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>;
  roles: Role[];
}
export interface RolesListProps {
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
}
export interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  input: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  onBackClick?: () => void;
  isSidebarOpen: boolean;
}
export interface MessageItemProps {
  message: Message;
}
export interface MessageInputProps {
  input: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
}
export interface MessageGroupProps {
  date: string;
  messages: Message[];
}
export interface SidebarProps {
  users: User[];
  // groups: Group[]; // Commented out groups prop
  selectedUser: User | null;
  // selectedGroup: Group | null; // Commented out selectedGroup prop
  onUserSelect: (user: User) => void;
  // onGroupSelect: (group: Group) => void; // Commented out onGroupSelect prop
  isOpen: boolean;
}
export interface LanguageOption {
  name: string;
  code: "en" | "fa";
  icon: string;
}
export interface UserSecurityType {
  googleId?: string;
  email: string;
}
export interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
}

export interface InviteData {
  email: string;
  role: string;
  avatar: string;
}
export interface UserTaskManagerType {
  id: string;
  name: string;
  avatar: string;
}
