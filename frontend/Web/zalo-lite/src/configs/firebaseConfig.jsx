// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "@firebase/app";
import { getAuth } from "@firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCp7x0lnETOmNhTfxbtyXj3jrkihhIOhKo",
    authDomain: "gnoodd-0211.firebaseapp.com",
    projectId: "gnoodd-0211",
    storageBucket: "gnoodd-0211.appspot.com",
    messagingSenderId: "102954778952",
    appId: "1:102954778952:web:91f759c58b6b114557337d",
    measurementId: "G-5WE4H03W6H"
};

// const firebaseConfig = {
//     apiKey: "AIzaSyDoNpR_1s0ey2ON3km_scFTffMEtGOf7YI",
//     authDomain: "bang-2e904.firebaseapp.com",
//     projectId: "bang-2e904",
//     storageBucket: "bang-2e904.appspot.com",
//     messagingSenderId: "1035224171288",
//     appId: "1:1035224171288:web:fc6af3b47faea07498146d",
//     measurementId: "G-7F4YN9FE8M"
// };



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);