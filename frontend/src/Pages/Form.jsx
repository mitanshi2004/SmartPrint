import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../App.css"; // assuming global styles like sidebar & green bg are here

function Form() {
  const location = useLocation();
  const preselectedType = location.state?.printType || '';
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    totalCopies: '',
    printType: preselectedType,
    pageRange: '',
    specialInstruction: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file");

    const data = new FormData();
    data.append('file', file);
    data.append('totalCopies', formData.totalCopies);
    data.append('printType', formData.printType);
    data.append('pageRange', formData.pageRange);
    data.append('specialInstruction', formData.specialInstruction);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:8080/print', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      alert(res.data.message);
      navigate('/congrats', { state: { token: res.data.tokenNumber } });
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="home-page">
      {/* <div className="sidebar">PRINT</div> */}
      <div className="form-right">
        <div className="form-box">
          <h2 className="text-2xl font-bold">SmartPrint</h2>

          <form onSubmit={handleSubmit} className="form-inner">
            <div className="input-group">
              <label>Upload Document:</label>
              <input type="file" name="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
            </div>

            <div className="input-group">
              <label>Total Copies:</label>
              <input type="number" name="totalCopies" value={formData.totalCopies} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label>Print Type:</label>
              <select name="printType" value={formData.printType} onChange={handleChange}>
                <option value="">Select</option>
                <option value="B/W Print">B/W Print</option>
                <option value="Color Print">Color Print</option>
                <option value="Hard Binding">Hard Binding</option>
                <option value="Spiral Binding">Spiral Binding</option>
                <option value="Passport Photo Print">Passport Photo Print</option>
                <option value="Glossy Print">Glossy Print</option>
                <option value="Lamination">Lamination</option>
                <option value="Resume/CV">Resume/CV</option>
                <option value="Aadhar/PAN Card">Aadhar/PAN Card</option>
              </select>
            </div>

            <div className="input-group">
              <label>Page Range:</label>
              <input type="text" name="pageRange" value={formData.pageRange} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Special Instruction:</label>
              <textarea name="specialInstruction" value={formData.specialInstruction} onChange={handleChange} />
            </div>

            <button type="submit">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;
