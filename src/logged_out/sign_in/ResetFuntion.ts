import { Auth, fetchSignInMethodsForEmail, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../shared/database/FirebaseConfig";



export async function resetPassword(email: string, auth: Auth): Promise<string> {
    try {
      // Check if the email exists in authentication
      const userCredential = await fetchSignInMethodsForEmail(auth, email);
  
      if (userCredential && userCredential.length === 0) {
        // Email doesn't exist
        return 'Email does not exist in authentication';
      }
  
      // Email exists, send password reset link
      await sendPasswordResetEmail(auth, email);
  
      // Reset link sent successfully
      return 'Password reset link sent successfully';
    } catch (error) {
      // Handle errors
      console.error('Error resetting password:', error);
      throw error;
    }
  }