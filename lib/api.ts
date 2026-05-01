import type { User, ApiResponse, LoginCredentials, RegisterData, OtpVerification, UserDetails } from "./types";
import { DEMO_OTP } from "./constants";

const NETWORK_DELAY = 1000;

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "resident": {
    password: "demo123",
    user: {
      id: "1",
      name: "Juan dela Cruz",
      email: "juan@email.com",
      phone: "09123456789",
      purok: "Purok 1 - Centro",
      userType: "resident",
    },
  },
  "collector": {
    password: "demo123",
    user: {
      id: "2",
      name: "Pedro Collector",
      email: "pedro@basurasmart.com",
      phone: "09987654321",
      purok: "Purok 1 - Centro",
      userType: "collector",
    },
  },
};

export async function registerUser(data: RegisterData): Promise<ApiResponse<{ phone: string }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: { phone: data.phone },
        message: "Registration successful. OTP sent to your phone.",
      });
    }, NETWORK_DELAY);
  });
}

export async function loginUser(credentials: LoginCredentials): Promise<ApiResponse<User>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { identifier, password } = credentials;
      const mockUser = MOCK_USERS[identifier.toLowerCase()];
      if (mockUser && mockUser.password === password) {
        resolve({
          success: true,
          data: mockUser.user,
          message: "Login successful",
        });
      } else {
        resolve({
          success: false,
          error: "Invalid credentials",
        });
      }
    }, NETWORK_DELAY);
  });
}

export async function verifyOtp(data: OtpVerification): Promise<ApiResponse<boolean>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (data.code === DEMO_OTP) {
        resolve({
          success: true,
          data: true,
          message: "OTP verified successfully",
        });
      } else {
        resolve({
          success: false,
          error: "Invalid OTP code",
        });
      }
    }, NETWORK_DELAY);
  });
}

export async function saveUserDetails(userId: string, details: UserDetails): Promise<ApiResponse<User>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user: User = {
        id: userId,
        name: "New User",
        email: "user@email.com",
        phone: "09*********",
        purok: details.purok,
        userType: details.userType,
      };
      
      resolve({
        success: true,
        data: user,
        message: "User details saved successfully",
      });
    }, NETWORK_DELAY);
  });
}

export async function getUserDetails(userId: string): Promise<ApiResponse<User>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockUser = Object.values(MOCK_USERS).find(u => u.user.id === userId);
      
      if (mockUser) {
        resolve({
          success: true,
          data: mockUser.user,
        });
      } else {
        resolve({
          success: false,
          error: "User not found",
        });
      }
    }, NETWORK_DELAY);
  });
}

export async function completePickup(routeId: string): Promise<ApiResponse<boolean>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: true,
        message: "Pickup completed successfully",
      });
    }, NETWORK_DELAY);
  });
}

export async function getPickupSchedule(userId: string): Promise<ApiResponse<{ schedule: any[]; reminders: any[] }>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          schedule: [],
          reminders: [],
        },
      });
    }, NETWORK_DELAY);
  });
}

export const api = {
  registerUser,
  loginUser,
  verifyOtp,
  saveUserDetails,
  getUserDetails,
  completePickup,
  getPickupSchedule,
};

export default api;