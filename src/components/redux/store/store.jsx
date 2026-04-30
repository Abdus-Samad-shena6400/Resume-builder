import { configureStore } from '@reduxjs/toolkit';
import { resumeReducer } from '../reducer';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
   
 },

});

store.subscribe(() => {
  try {
    const { resume } = store.getState();

    
    const serializableResume = {
      ...resume,
      profilePicture: null,
    };

    localStorage.setItem("resumeData", JSON.stringify(serializableResume));
  } catch (e) {
    console.log("Error saving to localStorage", e);
  }
});

export default store;
