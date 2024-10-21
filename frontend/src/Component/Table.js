import axios from 'axios';
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx'; // for Excel file handling
import 'material-icons/iconfont/material-icons.css';


export default function Table({ Deletuser, UpdatedUser }) {
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function FetchData() {
            try {
                const user = await axios.get('http://localhost:8080/api/get');
                const response = user.data;
                setData(response);
            } catch (error) {
                console.log(error);
            }
        }
        FetchData();
    }, []);

    // Filter data based on search query
    const filteredData = data.users?.filter(user => {
        return (
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.fathername.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase()) ||
            user.phone.includes(search)
        );
    });

    // Function to handle VCF file import
    const handleImportVCF = async (e) => {
        const file = e.target.files[0];
    
        // Check if a file is selected and has a .vcf extension
        if (file && file.name.endsWith('.vcf')) {
            const reader = new FileReader();
    
            reader.onload = async (evt) => {
                const vcfData = evt.target.result;
                const contacts = parseVCF(vcfData);
    
                // Send the contacts to the server
                try {
                    const response = await axios.post('http://localhost:8080/api/create', { contacts });
                    console.log(response.data); // Handle success response here
                    // Optionally, update the state to include newly added contacts
                    setData((prevData) => ({ users: [...prevData.users, ...contacts] }));
                } catch (error) {
                    console.error("Error saving contacts:", error);
                }
            };
    
            // Read the file as text
            reader.readAsText(file);
        } else {
            console.error("Please select a valid VCF file.");
        }
    };
    

    // Function to parse VCF file content
    const parseVCF = (vcfData) => {
        const lines = vcfData.split('\n');
        const contacts = [];
        let currentContact = {};

        lines.forEach(line => {
            line = line.trim();
            if (line.startsWith('BEGIN:VCARD')) {
                currentContact = {}; // Start a new contact
            } else if (line.startsWith('END:VCARD')) {
                contacts.push(currentContact); // Save the contact
            } else if (line.startsWith('FN:')) { // Full Name
                currentContact.name = line.substring(3);
            } else if (line.startsWith('N:')) { // Last Name
                const parts = line.substring(2).split(';');
                currentContact.fathername = parts[0] || '';
            } else if (line.startsWith('EMAIL:')) { // Email
                currentContact.email = line.substring(6);
            } else if (line.startsWith('TEL:')) { // Phone
                currentContact.phone = line.substring(4);
            }
        });

        return contacts;
    };

    // Export contacts to Excel
    const handleExport = () => {
        const ws = XLSX.utils.json_to_sheet(filteredData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
        XLSX.writeFile(wb, 'contacts.xlsx');
    };

    return (
        <>
            <div className='searchbar'>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="form-control"
                />
                <input
                    type="file"
                    accept=".vcf"
                    onChange={handleImportVCF}
                    className="form-control-file"
                />
                <button onClick={handleExport} className="btn btn-primary">Export Contacts</button>
            </div>
            <div className="container">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-sm-6">
                                <h2>Manage <b>Employees</b></h2>
                            </div>
                            <div className="col-sm-6">
                                <a href="#" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#addEmployeeModal">
                                    <i className="material-icons">&#xE147;</i> <span>Add New Employee</span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th></th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData?.map((elem) => (
                                <tr key={elem._id}>
                                    <td></td>
                                    <td>{elem.name}</td>
                                    <td>{elem.fathername}</td>
                                    <td>{elem.email}</td>
                                    <td>{elem.phone}</td>
                                    <td>
                                        <a href="#" className="edit cursor-pointer" data-bs-toggle="modal" data-bs-target="#editEmployeeModal" onClick={() => UpdatedUser(elem._id)}>
                                            <i className="material-icons" data-bs-toggle="tooltip" title="Edit">&#xE254;</i>
                                        </a>
                                        <a href="#" className="delete cursor-pointer" data-bs-toggle="modal" data-bs-target="#deleteEmployeeModal" onClick={() => Deletuser(elem._id)}>
                                            <i className="material-icons" data-bs-toggle="tooltip" title="Delete">&#xE872;</i>
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
