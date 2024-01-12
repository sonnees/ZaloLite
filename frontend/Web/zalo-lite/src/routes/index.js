import LoginForm from "../pages/login/LoginForm";
import Main from "../pages/Home/MainHome";

//Public Routes
export const publicRoutes = [
    { path: "/login", component: LoginForm },
    { path: "*", component: Main },
]

//Private Routes
export const privateRoutes = [

]

import Message from "../pages/Message"
import Contact from "../pages/Contact"
import Todo from "../pages/Todo"

export const publicMainHomeRoutes = [{
        path: "/",
        component: Message
    },
    {
        path: "/contact",
        component: Contact
    },
    {
        path: "/todo",
        component: Todo
    },
]