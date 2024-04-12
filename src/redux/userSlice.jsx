import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice ({
    name: "users" ,
    initialState : {

        users: []
    },
    reducers: {
        getUser : (state , action) =>{
            state.users =action.payload.map(user => {
                return {id : user._id , username : user.username , email: user.email , password : user.password , photo_user: user.photo_user, createdAt: user.createdAt}
            })

        },

        
        addUser : (state , action) => {
            state.users.push(action.payload)
        },

        deleteUser: (state, action )=> {
            const id = action.payload.id;
            state.users = state.users.filter(u => u.id !== id)
        },

        updateUser: (state , action) => {
            const index = state.users.findIndex( x => x.id === action.payload.id)
            state.users[index] = {
                id: action.payload.id,
                username : action.payload.username,
                email : action.payload.email,
                password : action.payload.password,
                photo_user : action.payload.photo_user
            }
        }
    }
})

export const {getUser ,addUser, deleteUser ,updateUser} = userSlice.actions;
export default userSlice.reducer;