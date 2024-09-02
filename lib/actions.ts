import axios from "axios";

export async function RigsSignIn(formData: FormData) {


  const response = await axios.post('/api/auth/register', formData);
  
}
