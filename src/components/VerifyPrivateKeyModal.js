import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

Modal.setAppElement('#root'); // Add this line

const VerifyPrivateKeyModal = ({ isOpen, onRequestClose }) => {
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setPrivateKey(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setPrivateKey(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/verify-private-key', {
        privateKey,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.valid) {
        onRequestClose();
        navigate('/checkout');
      } else {
        setError('Private key is invalid. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during verification. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Verify Private Key</h2>
      <div>
        <p>Please enter your private key to proceed to checkout:</p>
        <textarea
          value={privateKey}
          onChange={handleInputChange}
          rows={10}
          cols={50}
        />
        <div>
          <input type="file" accept=".pem,.txt" onChange={handleFileUpload} />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button onClick={handleVerify}>Verify</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default VerifyPrivateKeyModal;