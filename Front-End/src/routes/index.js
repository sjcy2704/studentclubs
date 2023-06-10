import { createWebHistory, createRouter, RouterLink } from "vue-router";
import { useUserStore } from "../stores/userStore";
import { api } from "../helpers/api";

const Home = () => import("../views/Home.vue");
const Clubs = () => import("../views/Clubs.vue");
const Login = () => import("../views/forms/Login.vue");
const SignUp = () => import("../views/forms/SignUp.vue");
const ClubSignUp = () => import("../views/forms/ClubRegisterForm.vue");
const ManageClubs = () => import("../views/ManageClubs.vue");
const RouterView = () => import("../views/RouterView.vue");
const MyClubs = () => import("../views/MyClubs.vue");
const ClubDetails = () => import("../views/ClubDetails.vue");
const NotFound = () => import("../views/404.vue");
const ManageClub = () => import("../views/ManageClub.vue");
const ManageMembers = () => import("../views/ManageMembers.vue");
const ManageEvents = () => import("../views/ManageEvents.vue");
const ManageAnnouncements = () => import("../views/ManageAnnouncements.vue");
const AddEvent = () => import("../views/forms/AddEvents.vue");
const AddNews = () => import("../views/forms/AddAnnouncement.vue");
const Announcement = () => import("../views/Announcement.vue");
const Event = () => import("../views/Event.vue");
const GuestList = () => import("../views/GuestList.vue");
const Profile = () => import("../views/Profile.vue");
const Settings = () => import("../views/forms/Settings.vue");
const Dashboard = () => import("../views/Dashboard.vue");
const AdminUsers = () => import("../views/AdminUsers.vue");
const AdminEvents = () => import("../views/AdminEvents.vue");
const AdminNews = () => import("../views/AdminNews.vue");
const AdminClubs = () => import("../views/AdminClubs.vue");

export const routes = [
  { name: "Home", path: "/", component: Home },
  {
    path: "/clubs",
    component: RouterView,
    children: [
      { name: "Clubs", path: "", component: Clubs },
      {
        path: "manage",
        component: ManageClubs,
        meta: { requiresAuth: true, privilages: true },
      },
      {
        path: "register",
        component: ClubSignUp,
        meta: { requiresAuth: true, privilages: true },
      },
      {
        name: "Club",
        path: ":clubID",
        component: ClubDetails,
      },
      {
        path: ":clubID/announcements",
        redirect: (to) => {
          return { name: "Club", params: { clubID: to.params.clubID } };
        },
      },
      {
        path: ":clubID/events",
        redirect: (to) => {
          return { name: "Club", params: { clubID: to.params.clubID } };
        },
      },
      {
        path: ":clubID/announcements/:newsID",
        component: Announcement,
      },
      {
        path: ":clubID/events/:eventID",
        component: Event,
      },
      {
        name: "ManageClub",
        path: ":clubID/manage",
        meta: { requiresAuth: true, privilages: true, manager: true },
        component: ManageClub,
      },
      {
        path: ":clubID/manage/members",
        component: ManageMembers,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/events",
        component: ManageEvents,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/announcements",
        component: ManageAnnouncements,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/events/add",
        component: AddEvent,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/events/:eventID",
        component: AddEvent,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/events/:eventID/guestlist",
        component: GuestList,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/announcements/add",
        component: AddNews,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/announcements/:newsID",
        component: AddNews,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
      {
        path: ":clubID/manage/details",
        component: ClubSignUp,
        meta: { requiresAuth: true, privilages: true, manager: true },
      },
    ],
  },
  {
    path: "/profile",
    component: RouterView,
    children: [
      {
        name: "Profile",
        path: "",
        component: Profile,
        meta: { requiresAuth: true },
      },
      { path: "clubs", component: MyClubs, meta: { requiresAuth: true } },
      { path: "settings", component: Settings, meta: { requiresAuth: true } },
    ],
  },
  {
    path: "/dashboard",
    component: RouterView,
    children: [
      { name: "Dashboard", path: "", component: Dashboard },
      { path: "users", component: AdminUsers },
      { path: "events", component: AdminEvents },
      { path: "announcements", component: AdminNews },
      { path: "clubs", component: AdminClubs },
    ],
  },
  {
    name: "Sign Up",
    path: "/signup",
    component: SignUp,
    meta: { guestOnly: true },
  },
  {
    name: "Login",
    path: "/login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
  {
    path: "/auth/google",
    redirect: (to) => {
      window.location.href = "http://localhost:8080/auth/google";
    },
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (userStore.loggedIn) {
      next();
      return;
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some((record) => record.meta.guestOnly)) {
    if (userStore.loggedIn) {
      next("/");
      return;
    }
    next();
  } else {
    next();
  }
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some((record) => record.meta.privilages)) {
    if (userStore.user.userType !== "user") {
      next();
      return;
    } else {
      next("/");
    }
  } else {
    next();
  }
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some((record) => record.meta.manager)) {
    if (userStore.user.userType === "admin") {
      next();
      return;
    } else if (userStore.user.userType === "manager") {
      await api.get(`/clubs/${to.params.clubID}/managers`).then(({ data }) => {
        if (!data.find((club) => club.manager === userStore.user.userID)) {
          next("/");
          return;
        }
      });
    }
    next();
  } else {
    next();
    return;
  }
});
