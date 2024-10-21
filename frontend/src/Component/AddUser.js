import React, { useRef, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddUser() {
    const [value, setValue] = useState({
        name: '',
        fathername: '',
        email: '',
        phone: ''
    });

    const handleOnchange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        });
    };

    const CloseRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Payload being sent:', value); // Add this line for debugging

        try {
            const adduser = await axios.post('http://localhost:8080/api/create', value);
            const response = adduser.data;
            if (response.success) {
                toast.success(response.message); // Adjusted to use response.message
                CloseRef.current.click();
            }
            console.log(response);
        } catch (error) {
            console.log(error);
            toast.error(`Error occurred while adding user: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <>
            <div id="addEmployeeModal" className="modal fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <div className="modal-header">
                                <h4 className="modal-title">Add Contact</h4>
                                <button type="button" className="close" data-bs-dismiss="modal" aria-hidden="true" ref={CloseRef}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <input type="text" value={value.name} name='name' onChange={handleOnchange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <input type="text" value={value.fathername} name='fathername' onChange={handleOnchange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" value={value.email} name='email' onChange={handleOnchange} className="form-control" required />
                                </div>
                                <div className="form-group">
                                    <label>Phone</label>
                                    <input type="text" value={value.phone} name='phone' onChange={handleOnchange} className="form-control" required />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <input type="button" className="btn btn-default" data-bs-dismiss="modal" value="Cancel" />
                                <input type="submit" className="btn btn-primary" value="Add" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
