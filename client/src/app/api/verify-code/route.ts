import axiosInstance from "@/lib/axios";

export async function POST(request: Request) { 

  try {
    const { id, code } = await request.json();
    console.log(id, "id", code, "code")

    await axiosInstance.get('/users/verify', {params: {uid:id, code}}).then((res) => { 
      return res.data;
    }).catch((err) => {
      console.log("error in verification", err);
      throw new Error("Error verifying user");
    })
    

    return Response.json(
      {
        success: true,
        message: "User verified successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
 
    console.error("Error verifying user", error);
    
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
