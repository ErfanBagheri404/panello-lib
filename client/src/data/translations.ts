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
    todayButton: string; // Add this
    filterButton: string; // Add this
    settings: SettingsTranslations;
    languages: LanguagesTranslations;
    navbar: NavbarTranslations;
    sidebar: SidebarTranslations;
    deleteButton: string; // Alphabetical order
    editButton: string;
    endLabel: string;
    startLabel: string;
    editEvent: string;
    createEvent: string;
    eventTitle: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    eventDurationError: string;
    saveChanges: string;
    existingEvents: string;
    description: string;
    day: string;
    week: string;
    month: string;
    inviteMember: string;
    emailAddress: string;
    emailPlaceholder: string;
    invalidEmail: string;
    userNotRegistered: string;
    selectRole: string;
    selectRolePlaceholder: string;
    nextButton: string;
    inviteButton: string;
    emailLabel: string;
    roleLabel: string;
    register: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    agreeTerms: string;
    termsAndConditions: string;
    termsRequired: string;
    continueWith: string;
    continueWithGoogle: string;
    haveAccount: string;
    login: string;
    registrationFailed: string;
    noAccount: string;
    rememberMe: string;
    loginFailed: string;
    backToWebsite: string;
    accessDenied: string;
    apiKeysUpdated: string;
    updateFailed: string;
    mongoDBApiKey: string;
    openRouterApiKey: string;
    updating: string;
    applyApiKeys: string;
    slogan: string;
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
    todayButton: "Today",
    filterButton: "Filter",
    editButton: "Edit",
    deleteButton: "Delete",
    startLabel: "Start",
    endLabel: "End",
    editEvent: "Edit Event",
    createEvent: "Create Event",
    eventTitle: "Event Title",
    startDate: "Start Date",
    startTime: "Start Time",
    endDate: "End Date",
    endTime: "End Time",
    eventDurationError: "Event duration must be at least 1 hour and 30 minutes",
    saveChanges: "Save Changes",
    existingEvents: "Existing Events",
    description: "Description",
    day: "Day",
    week: "Week",
    month: "Month",
    inviteMember: "Invite Member",
    emailAddress: "Email Address",
    emailPlaceholder: "user@example.com",
    invalidEmail: "Invalid email",
    userNotRegistered: "User not registered",
    selectRole: "Select Role",
    selectRolePlaceholder: "Select a role",
    nextButton: "Next",
    inviteButton: "Invite",
    emailLabel: "Email",
    roleLabel: "Role",
    register: "Create an account",
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    password: "Password",
    agreeTerms: "I agree to the",
    termsAndConditions: "Terms & Conditions",
    termsRequired: "You must agree to the terms and conditions",
    continueWith: "Or continue with",
    continueWithGoogle: "Continue with Google",
    haveAccount: "Already have an account?",
    login: "Log in",
    registrationFailed: "Registration failed",
    noAccount: "Don't have an account?",
    rememberMe: "Remember me",
    loginFailed: "Login failed",
    backToWebsite: "Back to website",
    slogan: "Capturing Moments, Creating Memories",
    accessDenied: "Access denied. Only owners can manage API keys.",
    apiKeysUpdated: "API keys updated successfully.",
    updateFailed: "Failed to update API keys.",
    mongoDBApiKey: "MongoDB API Key",
    openRouterApiKey: "OpenRouter API Key",
    updating: "Updating...",
    applyApiKeys: "Apply API Keys",
  },
  fa: {
    welcome: "خوش آمدید، عرفان",
    questionPrompt: "امروز چه کاری می‌توانم برای شما انجام دهم؟",
    askQuestion: "سوال بپرسید",
    createTask: "ایجاد وظیفه جدید",
    manageMembers: "مدیریت اعضا",
    myTasks: "وظایف من",
    addNewTask: "افزودن وظیفه جدید",
    tasks: "وظایف",
    members: "اعضا",
    reminders: "یادآوری ها",
    addNewReminder: "افزودن یادآوری جدید",
    noRemindersMessage:
      "برای افزودن اولین یادآوری، روی دکمه %dots% بالا کلیک کنید",
    cancelButton: "لغو",
    addReminderButton: "افزودن یادآوری",
    reminderTextPlaceholder: "متن یادآوری",
    totalIncome: "درآمد کل",
    increaseComparison: "افزایش ۲۴٪ نسبت به هفته گذشته",
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
    addSubtask: "افزودن زیروظیفه",
    createTaskButton: "ایجاد وظیفه",
    updateTask: "به‌روزرسانی وظیفه",
    deleteTask: "حذف وظیفه",
    deleteSubtask: "حذف",
    newSubtaskInput: "زیروظیفه جدید",
    startConversation: "شروع مکالمه",
    askPlaceholder: "سوالی بپرسید...",
    send: "ارسال",
    pause: "توقف",
    loadingResponse: "...",
    modelSwitchError:
      "به دلیل خطا، به %model% تغییر یافت. لطفاً دوباره تلاش کنید.",
    humorCommands: [
      "یک لطیفه بگو!",
      "چرا دانشمندان به اتم‌ها اعتماد نمی‌کنند؟",
      "چه چیزی کلید دارد اما نمی‌تواند قفل را باز کند؟",
    ],
    weatherCommands: [
      "هوای امروز چگونه است؟",
      "آیا فردا باران می‌بارد؟",
      "هوای نیویورک چطور است؟",
    ],
    bookCommands: [
      "یک کتاب پیشنهاد کنید.",
      "چه کتاب خوبی برای خواندن پیشنهاد می‌کنید؟",
      "یک کتاب علمی-تخیلی پیشنهاد کنید.",
    ],
    categories: ["طنز", "هوا", "کتاب"],
    inviteMembersPrompt:
      "می‌خواهید عضو جدیدی به گروه خود دعوت کنید؟ با چند گام ساده این کار را انجام دهید!",
    inviteMembersNote:
      "(مطمئن شوید که نقش‌های گروه خود را تنظیم کرده‌اید و ایمیل عضو را دارید)",
    inviteMembersButton: "+ دعوت از اعضا",
    membersListHeader: "اعضا",
    memberHeader: "عضو",
    roleHeader: "نقش",
    dateAddedHeader: "تاریخ عضویت",
    activityStatusHeader: "وضعیت فعالیت",
    accountStateHeader: "وضعیت حساب",
    actionsSelectedUsers: "اقدامات برای اعضای انتخاب‌شده:",
    actionOptions: "گزینه‌ها",
    banAction: "مسدود کردن",
    changeRoleAction: "تغییر نقش",
    removeAction: "حذف",
    applyAction: "اعمال",
    promptChangeRole: "نقش جدید را وارد کنید:",
    deactivatedBanned: "غیرفعال (مسدود شده)",
    rolesListHeader: "نقش‌ها",
    deleteAction: "حذف",
    editAction: "ویرایش",
    duplicateAction: "کپی کردن",
    actionsSelectedRoles: "اقدامات برای نقش‌های انتخاب‌شده:",
    descriptionHeader: "توضیحات",
    duplicateSuffix: " (کپی)",
    messages: "پیام‌ها",
    searchPlaceholder: "جستجو",
    filterAll: "همه",
    filterPeople: "افراد",
    filterGroups: "گروه‌ها",
    online: "آنلاین",
    offline: "آفلاین",
    viewProfile: "مشاهده پروفایل",
    backButton: "بازگشت",
    typeMessage: "پیام خود را وارد کنید...",
    locale: "fa-IR",
    restrictedMessage: "لطفاً برای دسترسی با مدیر خود تماس بگیرید.",
    settings: {
      title: "تنظیمات",
      manageAccount: "از اینجا حساب خود را مدیریت کنید.",
      generalTab: "عمومی",
      securityTab: "امنیت",
      apiTab: "API",
      profilePictureTitle: "عکس پروفایل",
      profilePictureDescription: "عکس پروفایل خود را به‌روزرسانی کنید.",
      replaceImage: "تغییر تصویر",
      interfaceThemeTitle: "تم رابط کاربری",
      interfaceThemeDescription: "تم رابط کاربری خود را انتخاب یا سفارشی کنید.",
      systemTheme: "سیستم",
      lightTheme: "روشن",
      darkTheme: "تیره",
      languageTitle: "زبان",
      languageDescription: "زبان داشبورد را تغییر دهید.",
      accountTitle: "حساب",
      accountDescription: "تنظیمات حساب خود را مدیریت کنید.",
      logout: "خروج",
      googleUserMessage: "تغییر رمز عبور برای کاربران گوگل ممکن نیست.",
      currentPassword: "رمز عبور فعلی",
      newPassword: "رمز عبور جدید",
      confirmPassword: "تأیید رمز عبور",
      changePassword: "تغییر رمز عبور",
      loading: "در حال بارگذاری...",
      passwordMismatchError: "رمزهای عبور جدید هم‌خوانی ندارند",
      passwordChangeSuccess: "رمز عبور با موفقیت تغییر یافت",
      notLoggedInError: "برای دسترسی به این صفحه باید وارد شوید",
      fetchUserError: "دریافت اطلاعات کاربر با خطا مواجه شد",
      passwordChangeError: "تغییر رمز عبور با خطا مواجه شد",
      mongoDBApiKey: "کلید API MongoDB",
      openRouterApiKey: "کلید API OpenRouter",
      applyApiKeys: "اعمال کلیدهای API",
    },
    languages: {
      englishUS: "انگلیسی (ایالات متحده)",
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
        "شما هنوز به این فضای کاری دعوت نشده‌اید. لطفاً برای دسترسی با مدیر خود تماس بگیرید。",
    },
    todayButton: "امروز",
    filterButton: "فیلتر",
    editButton: "ویرایش",
    deleteButton: "حذف",
    startLabel: "شروع",
    endLabel: "پایان",
    editEvent: "ویرایش رویداد",
    createEvent: "ایجاد رویداد",
    eventTitle: "عنوان رویداد",
    startDate: "تاریخ شروع",
    startTime: "زمان شروع",
    endDate: "تاریخ پایان",
    endTime: "زمان پایان",
    eventDurationError: "مدت زمان رویداد باید حداقل ۱ ساعت و ۳۰ دقیقه باشد",
    saveChanges: "ذخیره تغییرات",
    existingEvents: "رویدادهای موجود",
    description: "توضیحات",
    day: "روز",
    week: "هفته",
    month: "ماه",
    inviteMember: "دعوت عضو",
    emailAddress: "آدرس ایمیل",
    emailPlaceholder: "user@example.com",
    invalidEmail: "ایمیل نامعتبر",
    userNotRegistered: "کاربر ثبت‌نام نکرده است",
    selectRole: "انتخاب نقش",
    selectRolePlaceholder: "یک نقش انتخاب کنید",
    nextButton: "بعدی",
    inviteButton: "دعوت",
    emailLabel: "ایمیل",
    roleLabel: "نقش",
    register: "ساخت حساب کاربری",
    firstName: "نام",
    lastName: "نام خانوادگی",
    email: "پست الکترونیک",
    password: "رمزعبور",
    agreeTerms: "با مقررات موافقم",
    termsAndConditions: "شرایط و قوانین",
    termsRequired: "شما باید با مقررات موافقت کنید",
    continueWith: "یا ادامه دهید با",
    continueWithGoogle: "با گوگل وارد شوید",
    haveAccount: "حساب کاربری دارید؟",
    login: "ورود",
    registrationFailed: "ثبت نام ناموفق",
    noAccount: "حساب کاربری ندارید؟",
    rememberMe: "مرا به خاطر بسپار",
    loginFailed: "ورود ناموفق",
    backToWebsite: "بازگشت به سایت",
    slogan: "گرفتن لحظات، ساختن یادگارها",
    accessDenied:
      "دسترسی ممنوع. فقط صاحبان می‌توانند کلیدهای API را مدیریت کنند.",
    apiKeysUpdated: "کلیدهای API با موفقیت به‌روزرسانی شدند.",
    updateFailed: "به‌روزرسانی کلیدهای API ناموفق بود.",
    mongoDBApiKey: "کلید API MongoDB",
    openRouterApiKey: "کلید API OpenRouter",
    updating: "در حال به‌روزرسانی...",
    applyApiKeys: "اعمال کلیدهای API",
  },
} as const;

export default translations;
