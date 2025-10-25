import React from "react";
import logo from "@/components/assets/DeloitteNewSmall.png"

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
       <img src={logo} alt="Deloitte Logo" className="header-logo" />
        <div>
          <h1>Deloitte</h1>
          
        </div>
      </div>

      <style>{`
        .header {
          background-color: #001f4d; /* Navy blue */
          color: white;
          padding: 20px 0;          /* Header thickness */
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
        }

        .header-content {
          display: flex;
          align-items: center;
          text-align: left;
          padding-left: 40px;
          gap: 15px; /* Space between logo and text */
        }

        .header-logo {
          height: 50px;     /* Adjust logo height */
          width: auto;      /* Maintain aspect ratio */
        }

        .header-content h1 {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }

        .header-content p {
          font-size: 14px;
          margin-top: 5px;
        }
      `}</style>
    </header>
  );
};

export default Header;
