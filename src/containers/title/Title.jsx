import React from "react";
import "./title.css";
import main_logo_tag from "../../assets/branding/ocellai_logo-tag_lighter.png";

const Title = () => {
  return (
    <div className="title">
      <img src={main_logo_tag} alt="ocell.ai log" />
      <h3>version 1.0.0</h3>
    </div>
  );
};

export default Title;
