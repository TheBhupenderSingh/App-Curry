import { RequestHandler } from "express";
import axios from "axios";

// Mock user database - in production this would be a real database


interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
    department: string;
    status: string;
  };
  token?: string;
}

const API_BASE = "http://localhost:9090";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password, role }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const loginRes = await axios.post(`${API_BASE}/auth/login`, {
      email,
      password,
      role,
    });

    const user = loginRes.data;


    // Check if user exists
    if (!user || !user.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
  
     const assignmentRes = await axios.get(`${API_BASE}/admin/assignments`, {
      params: { userId: user.id },
    });


    const assignment = assignmentRes.data[0];

    if (!assignment) {
      return res.status(401).json({
        success: false,
        message: "Invalid assignment fetch",
      });
    }

    // Step 3: Build response
    const response: LoginResponse = {
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        role: user.role,
        permissions: [], // you can later fill from backend if needed
        department: assignment?.subDivision?.division?.name || "N/A",
        status: assignment?.designation?.name || "N/A",
      },
      token: `mock_jwt_token_${Date.now()}_${user.role}`, // replace with real JWT later
    };



    res.status(200).json(response);
  } catch (error: any) {
    console.error("Login error:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const handleLogout: RequestHandler = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const handleVerifyToken: RequestHandler = (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    if (!token.startsWith("mock_jwt_token_")) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    const tokenParts = token.split("_");
    const role = tokenParts[tokenParts.length - 1];

    res.status(200).json({
      success: true,
      message: "Token is valid",
      role,
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};