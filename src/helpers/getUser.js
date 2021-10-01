import {doGet} from './request'

export default async function getUser(){
    try{
        const response = await doGet({path:'user'});
        if(!response.ok){
            return {err: response.statusText, user: null}
        }
        const data = await response.json();
        const user = data.data;
        return {err: null, user: user};
    }catch(err){
        
        return {
            err: "Something Went Wrong",
            user: null
        }
    }
}