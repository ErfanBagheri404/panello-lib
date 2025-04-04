// translations.ts

type SettingsTranslations = {
  title: string;
  manageAccount: string;
  generalTab: string;
  securityTab: string;
  apiTab: string;
  profilePictureTitle: string;
  profilePictureDescription: string;
  replaceImage: string;
  interfaceThemeTitle: string;
  interfaceThemeDescription: string;
  systemTheme: string;
  lightTheme: string;
  darkTheme: string;
  languageTitle: string;
  languageDescription: string;
  accountTitle: string;
  accountDescription: string;
  logout: string;
  googleUserMessage: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  changePassword: string;
  loading: string;
  passwordMismatchError: string;
  passwordChangeSuccess: string;
  notLoggedInError: string;
  fetchUserError: string;
  passwordChangeError: string;
  mongoDBApiKey: string;
  openRouterApiKey: string;
  applyApiKeys: string;
};

type LanguagesTranslations = {
  englishUS: string;
  persian: string;
};

type NavbarTranslations = {
  home: string;
  aiTools: string;
  members: string;
  graphsAndCharts: string;
  calendar: string;
  messages: string;
  settings: string;
  dashboard: string;
  logout: string;
};

type SidebarTranslations = {
  home: string;
  aiTools: string;
  members: string;
  graphsAndCharts: string;
  calendar: string;
  messages: string;
  settings: string;
  panello: string;
  tasks: string;
  addTask: string;
  inviteDescription: string;
  inviteMembers: string;
  closeSidebar: string;
  searchPlaceholder: string;
  filterAll: string;
  filterPeople: string;
  filterGroups: string;
  online: string;
  offline: string;
  viewProfile: string;
  accessRestricted: string;
};

type Language = "en" | "fa";

type Translations = {
  [key in Language]: {
    welcome: string;
    questionPrompt: string;
    askQuestion: string;
    createTask: string;
    manageMembers: string;
    myTasks: string;
    addNewTask: string;
    tasks: string;
    members: string;
    reminders: string;
    addNewReminder: string;
    noRemindersMessage: string;
    cancelButton: string;
    addReminderButton: string;
    reminderTextPlaceholder: string;
    totalIncome: string;
    increaseComparison: string;
    calendar: string;
    noEventsMessage: string;
    days: string[];
    months: string[];
    editTask: string;
    newTask: string;
    taskTitle: string;
    addSubtask: string;
    createTaskButton: string;
    updateTask: string;
    deleteTask: string;
    deleteSubtask: string;
    newSubtaskInput: string;
    startConversation: string;
    askPlaceholder: string;
    send: string;
    pause: string;
    loadingResponse: string;
    modelSwitchError: string;
    humorCommands: string[];
    weatherCommands: string[];
    bookCommands: string[];
    categories: string[];
    inviteMembersPrompt: string;
    inviteMembersNote: string;
    inviteMembersButton: string;
    membersListHeader: string;
    memberHeader: string;
    roleHeader: string;
    dateAddedHeader: string;
    activityStatusHeader: string;
    accountStateHeader: string;
    actionsSelectedUsers: string;
    actionOptions: string;
    banAction: string;
    changeRoleAction: string;
    removeAction: string;
    applyAction: string;
    promptChangeRole: string;
    deactivatedBanned: string;
    rolesListHeader: string;
    deleteAction: string;
    editAction: string;
    duplicateAction: string;
    actionsSelectedRoles: string;
    descriptionHeader: string;
    duplicateSuffix: string;
    messages: string;
    searchPlaceholder: string;
    filterAll: string;
    filterPeople: string;
    filterGroups: string;
    online: string;
    offline: string;
    viewProfile: string;
    backButton: string;
    typeMessage: string;
    locale: string;
    restrictedMessage: string; // Added for the component
    settings: SettingsTranslations;
    languages: LanguagesTranslations;
    navbar: NavbarTranslations;
    sidebar: SidebarTranslations;
  };
};

const translations: Translations = {
  en: {
    welcome: "Welcome Back, Erfan",
    questionPrompt: "What can I do for you today?",
    askQuestion: "Ask a Question",
    createTask: "Create a new task",
    manageMembers: "Manage Members",
    myTasks: "My Tasks",
    addNewTask: "Add a new task",
    tasks: "tasks",
    members: "members",
    reminders: "Reminders",
    addNewReminder: "Add New Reminder",
    noRemindersMessage:
      "Tap the %dots% button above to add your first reminder",
    cancelButton: "Cancel",
    addReminderButton: "Add Reminder",
    reminderTextPlaceholder: "Reminder text",
    totalIncome: "Total Income",
    increaseComparison: "24% increase compared to last week",
    calendar: "Calendar",
    noEventsMessage: "No events for this date",
    days: ["Sun", "Mon ", "Tue ", "Wed ", "Thur", "Fri ", "Sat"],
    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    editTask: "Edit Task",
    newTask: "New Task",
    taskTitle: "Task title",
    addSubtask: "Add Subtask",
    createTaskButton: "Create Task",
    updateTask: "Update Task",
    deleteTask: "Delete Task",
    deleteSubtask: "Delete",
    newSubtaskInput: "New subtask",
    startConversation: "Start a Conversation",
    askPlaceholder: "Ask something...",
    send: "Send",
    pause: "Pause",
    loadingResponse: "...",
    modelSwitchError: "Switched to %model% due to an error. Please try again.",
    humorCommands: [
      "Tell me a joke!",
      "Why don't scientists trust atoms?",
      "What has keys but can't open locks?",
    ],
    weatherCommands: [
      "What's the weather like today?",
      "Is it going to rain tomorrow?",
      "Can you describe the weather in New York?",
    ],
    bookCommands: [
      "Recommend a book for me.",
      "What's a good book to read?",
      "Can you suggest a science fiction book?",
    ],
    categories: ["Humor", "Weather", "Books"],
    inviteMembersPrompt:
      "Want to have a new member for your group? Invite them through a few steps!",
    inviteMembersNote:
      "(Make sure you have already set the roles for your group and have the member’s email)",
    inviteMembersButton: "+ Invite Members",
    membersListHeader: "Members",
    memberHeader: "Member",
    roleHeader: "Role",
    dateAddedHeader: "Date added",
    activityStatusHeader: "Activity status",
    accountStateHeader: "Account state",
    actionsSelectedUsers: "Actions to do with selected users:",
    actionOptions: "Options",
    banAction: "Ban",
    changeRoleAction: "Change Role",
    removeAction: "Remove",
    applyAction: "Apply",
    promptChangeRole: "Enter new role:",
    deactivatedBanned: "Deactivated (Banned)",
    rolesListHeader: "Roles",
    deleteAction: "Delete",
    editAction: "Edit",
    duplicateAction: "Duplicate",
    actionsSelectedRoles: "Actions for selected roles:",
    descriptionHeader: "Description",
    duplicateSuffix: " (Copy)",
    messages: "Messages",
    searchPlaceholder: "Search",
    filterAll: "ALL",
    filterPeople: "PEOPLE",
    filterGroups: "GROUPS",
    online: "Online",
    offline: "Offline",
    viewProfile: "View Profile",
    backButton: "Back",
    typeMessage: "Type a message...",
    locale: "en-US",
    restrictedMessage: "Please contact your administrator for access.",
    settings: {
      title: "Settings",
      manageAccount: "Manage your account through here.",
      generalTab: "General",
      securityTab: "Security",
      apiTab: "API",
      profilePictureTitle: "Profile Picture",
      profilePictureDescription: "Update your Profile Picture.",
      replaceImage: "Replace image",
      interfaceThemeTitle: "Interface theme",
      interfaceThemeDescription: "Select or customize your UI theme.",
      systemTheme: "System",
      lightTheme: "Light",
      darkTheme: "Dark",
      languageTitle: "Language",
      languageDescription: "Change Dashboard's language.",
      accountTitle: "Account",
      accountDescription: "Manage your account settings.",
      logout: "Logout",
      googleUserMessage: "Password change is not available for Google users.",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      changePassword: "Change Password",
      loading: "Loading...",
      passwordMismatchError: "New passwords do not match",
      passwordChangeSuccess: "Password changed successfully",
      notLoggedInError: "You must be logged in to access this page",
      fetchUserError: "Failed to fetch user data",
      passwordChangeError: "Failed to change password",
      mongoDBApiKey: "MongoDB API Key",
      openRouterApiKey: "OpenRouter API Key",
      applyApiKeys: "Apply API Keys",
    },
    languages: {
      englishUS: "English US",
      persian: "Persian",
    },
    navbar: {
      home: "Home",
      aiTools: "AI Tools",
      members: "Members",
      graphsAndCharts: "Graphs & Charts",
      calendar: "Calendar",
      messages: "Messages",
      settings: "Settings",
      dashboard: "Dashboard",
      logout: "Logout",
    },
    sidebar: {
      home: "Home",
      aiTools: "AI Tools",
      members: "Members",
      graphsAndCharts: "Graphs & Charts",
      calendar: "Calendar",
      messages: "Messages",
      settings: "Settings",
      panello: "Panello",
      tasks: "Tasks",
      addTask: "+ Add",
      inviteDescription:
        "New members will gain access to public Spaces, Docs, and Dashboards",
      inviteMembers: "+ Invite Members",
      closeSidebar: "Close Sidebar",
      searchPlaceholder: "Search",
      filterAll: "ALL",
      filterPeople: "PEOPLE",
      filterGroups: "GROUPS",
      online: "Online",
      offline: "Offline",
      viewProfile: "View Profile",
      accessRestricted:
        "You haven't been invited to this workspace yet. Please contact your administrator for access.",
    },
  },
  fa: {
    welcome: "خوش آمدید، عرفان",
    questionPrompt: "امروز چه کاری می‌توانم برای شما انجام دهم؟",
    askQuestion: "یک سوال بپرس",
    createTask: "ایجاد وظیفه جدید",
    manageMembers: "مدیریت اعضا",
    myTasks: "وظایف من",
    addNewTask: "وظیفه جدید اضافه کن",
    tasks: "وظایف",
    members: "اعضا",
    reminders: "یادآوری ها",
    addNewReminder: "یادآوری جدید افزودن",
    noRemindersMessage:
      "بر روی دکمه %dots% بالا کلیک کنید تا اولین یادآوری خود را اضافه کنید",
    cancelButton: "لغو",
    addReminderButton: "افزودن یادآوری",
    reminderTextPlaceholder: "متن یادآوری",
    totalIncome: "درآمد کل",
    increaseComparison: "۲۴٪ افزایش نسبت به هفته گذشته",
    calendar: "تقویم",
    noEventsMessage: "هیچ رویدادی برای این تاریخ وجود ندارد",
    days: [
      "یکشنبه",
      "دوشنبه",
      "سه‌شنبه",
      "چهارشنبه",
      "پنج‌شنبه",
      "جمعه",
      "شنبه",
    ],
    months: [
      "ژانویه",
      "فوریه",
      "مارس",
      "آوریل",
      "می",
      "ژوئن",
      "جولای",
      "اوت",
      "سپتامبر",
      "اکتبر",
      "نوامبر",
      "دسامبر",
    ],
    editTask: "ویرایش وظیفه",
    newTask: "وظیفه جدید",
    taskTitle: "عنوان وظیفه",
    addSubtask: "اضافه کردن زیر وظیفه",
    createTaskButton: "ایجاد وظیفه",
    updateTask: "آپدیت کردن وظیفه",
    deleteTask: "حذف وظیفه",
    deleteSubtask: "حذف",
    newSubtaskInput: "زیر وظیفه جدید",
    startConversation: "شروع یک مکالمه",
    askPlaceholder: "سوال خود را بنویسید...",
    send: "ارسال",
    pause: "پاوزه",
    loadingResponse: "...",
    modelSwitchError:
      "به %model% تغییر داده شد به دلیل خطایی. لطفا دوباره امتحان کنید。",
    humorCommands: [
      "یک دیل بگو!",
      "چرا افراد علمی اتم ها را مطمئن نیستند؟",
      "چیزی دارای کلید است اما نمیتواند قفل را باز کند؟",
    ],
    weatherCommands: [
      "آب و هوا امروز چطور است؟",
      "فردا باران خواهد شد؟",
      "آب و هوا نیویورک چگونه است؟",
    ],
    bookCommands: [
      "یه کتاب توصیه کن.",
      "کتاب خوبی برای خواندن وجود دارد؟",
      "کتاب علمی تخیلی توصیه کنید。",
    ],
    categories: ["ظنز", "آب و هوا", "کتاب ها"],
    inviteMembersPrompt:
      "می خواهید عضو جدیدی برای گروه خود داشته باشید؟ با گذشتن چند مرحله، آنها را دعوت کنید!",
    inviteMembersNote:
      "(مطمئن شوید که نقش های گروه خود را تنظیم کرده اید و ایمیل عضو را دارید)",
    inviteMembersButton: "+ افزودن عضو",
    membersListHeader: "اعضا",
    memberHeader: "عضو",
    roleHeader: "نقش",
    dateAddedHeader: "تاریخ عضویت",
    activityStatusHeader: "وضعیت فعالیت",
    accountStateHeader: "وضعیت حساب",
    actionsSelectedUsers: "عملیات برای اعضا انتخاب شده:",
    actionOptions: "گزینه ها",
    banAction: "بن دادن",
    changeRoleAction: "تغییر نقش",
    removeAction: "حذف",
    applyAction: "اعمال",
    promptChangeRole: "نقش جدید را وارد کنید:",
    deactivatedBanned: "غیرفعال شده (بن شده)",
    rolesListHeader: "نقش ها",
    deleteAction: "حذف",
    editAction: "ویرایش",
    duplicateAction: "کپی کردن",
    actionsSelectedRoles: "عملیات برای نقش های انتخاب شده:",
    descriptionHeader: "توضیحات",
    duplicateSuffix: " (کپی)",
    messages: "پیام ها",
    searchPlaceholder: "جستجو",
    filterAll: "همه",
    filterPeople: "افراد",
    filterGroups: "گروه ها",
    online: "آنلاین",
    offline: "آفلاین",
    viewProfile: "مشاهده پروفایل",
    backButton: "بازگشت",
    typeMessage: "پیام خود را وارد کنید...",
    locale: "fa-IR",
    restrictedMessage: "لطفاً برای دسترسی با سرپرست خود تماس بگیرید.",
    settings: {
      title: "تنظیمات",
      manageAccount: "حساب خود را از طریق اینجا مدیریت کنید.",
      generalTab: "عمومی",
      securityTab: "امنیت",
      apiTab: "API",
      profilePictureTitle: "عکس پروفایل",
      profilePictureDescription: "عکس پروفایل خود را به‌روزرسانی کنید.",
      replaceImage: "جایگزینی تصویر",
      interfaceThemeTitle: "تم رابط کاربری",
      interfaceThemeDescription: "تم رابط کاربری خود را انتخاب یا سفارشی کنید.",
      systemTheme: "سیستم",
      lightTheme: "روشن",
      darkTheme: "تیره",
      languageTitle: "زبان",
      languageDescription: "زبان داشبورد را تغییر دهید.",
      accountTitle: "حساب",
      accountDescription: "تنظیمات حساب خود را مدیریت کنید。",
      logout: "خروج",
      googleUserMessage: "تغییر رمز عبور برای کاربران گوگل در دسترس نیست.",
      currentPassword: "رمز عبور فعلی",
      newPassword: "رمز عبور جدید",
      confirmPassword: "تأیید رمز عبور",
      changePassword: "تغییر رمز عبور",
      loading: "در حال بارگذاری...",
      passwordMismatchError: "رمزهای عبور جدید مطابقت ندارند",
      passwordChangeSuccess: "رمز عبور با موفقیت تغییر یافت",
      notLoggedInError: "برای دسترسی به این صفحه باید وارد شوید",
      fetchUserError: "دریافت اطلاعات کاربر ناموفق بود",
      passwordChangeError: "تغییر رمز عبور ناموفق بود",
      mongoDBApiKey: "کلید API MongoDB",
      openRouterApiKey: "کلید API OpenRouter",
      applyApiKeys: "اعمال کلیدهای API",
    },
    languages: {
      englishUS: "انگلیسی",
      persian: "فارسی",
    },
    navbar: {
      home: "خانه",
      aiTools: "ابزارهای هوش مصنوعی",
      members: "اعضا",
      graphsAndCharts: "نمودارها و جداول",
      calendar: "تقویم",
      messages: "پیام‌ها",
      settings: "تنظیمات",
      dashboard: "داشبورد",
      logout: "خروج",
    },
    sidebar: {
      home: "خانه",
      aiTools: "ابزارهای هوش مصنوعی",
      members: "اعضا",
      graphsAndCharts: "نمودارها و جداول",
      calendar: "تقویم",
      messages: "پیام‌ها",
      settings: "تنظیمات",
      panello: "پانلو",
      tasks: "وظایف",
      addTask: "+ افزودن",
      inviteDescription:
        "اعضای جدید به فضاهای عمومی، اسناد و داشبوردها دسترسی خواهند داشت",
      inviteMembers: "+ دعوت از اعضا",
      closeSidebar: "بستن نوار کناری",
      searchPlaceholder: "جستجو",
      filterAll: "همه",
      filterPeople: "افراد",
      filterGroups: "گروه‌ها",
      online: "آنلاین",
      offline: "آفلاین",
      viewProfile: "مشاهده پروفایل",
      accessRestricted:
        "شما هنوز به این فضای کاری دعوت نشده اید. لطفاً برای دسترسی با سرپرست خود تماس بگیرید。",
    },
  },
} as const;

export default translations;