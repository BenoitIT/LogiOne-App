"use client"

import { Button } from "../ui/button"
import { FcGoogle } from "react-icons/fc"

export const Social = () => {
    return(
        <div className="flex items-center w-full gap-x-2">
            <Button variant="outline" size="lg" className="w-full" onClick={()=>{}}>
               <span className="pl pr-2 font-bold">Or continue with</span> <FcGoogle className="w-5 h-5"/>
            </Button>
            </div>
    )
}