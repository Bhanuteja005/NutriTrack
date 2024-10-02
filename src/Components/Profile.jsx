import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth, db } from "../config/firebase";

function Profile() {
    const [name1, setName] = useState("");
    const [gender1, setGender] = useState("");
    const [height1, setHeight] = useState(0);
    const [weight1, setWeight] = useState(0);
    const [age1, setAge] = useState(0);
    const [uid, setUid] = useState(null);
    const [docExists, setDocExists] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [allergyToggle, setAllergyToggle] = useState(false);
    const [allergyInput, setAllergyInput] = useState("");
    const [allergies, setAllergies] = useState([]);
    const [chronicDiseases, setChronicDiseases] = useState([]);

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleAllergyToggle = () => {
        setAllergyToggle(!allergyToggle);
    };

    const handleAllergyInputChange = (e) => {
        setAllergyInput(e.target.value);
    };

    const handleAddAllergy = async () => {
        if (allergyInput.trim()) {
            const updatedAllergies = [...allergies, allergyInput.trim()]; // Create the updated list here
            setAllergies(updatedAllergies);
            setAllergyInput("");
            setAllergyToggle(false);
    
            try {
                const userDocRef = doc(db, "Demographics", uid);
                const userDoc = await getDoc(userDocRef);
    
                const data = {
                    Allergies: updatedAllergies // Use the updated list here
                };
    
                if (userDoc.exists()) {
                    await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
                    toast.success("Details updated successfully!");
                } else {
                    await setDoc(userDocRef, data);
                    toast.success("Details submitted successfully!");
                }
            } catch (error) {
                console.log(error);
                toast.error("An error occurred while submitting your details.");
            }
        }
    };

    const handleAddChronicDisease = async (disease) => {
        const updatedChronicDiseases = [...chronicDiseases, disease]; // Create the updated list here
        setChronicDiseases(updatedChronicDiseases);
        setDropdownVisible(false);
    
        try {
            const userDocRef = doc(db, "Demographics", uid);
            const userDoc = await getDoc(userDocRef);
    
            const data = {
                ChronicDiseases: updatedChronicDiseases // Use the updated list here
            };
    
            if (userDoc.exists()) {
                await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
                toast.success("Details updated successfully!");
            } else {
                await setDoc(userDocRef, data);
                toast.success("Details submitted successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while submitting your details.");
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                checkUserDoc(user.uid);
                fetchUserDetails(user.uid);
            } else {
                setUid(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const checkUserDoc = async (userId) => {
        const userDocRef = doc(db, "Demographics", userId);
        const userDoc = await getDoc(userDocRef);
        setDocExists(userDoc.exists());
    };

    const fetchUserDetails = async (userId) => {
        try {
            const userDocRef = doc(db, "Demographics", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const data = userDoc.data();
                setName(data.Name);
                setGender(data.Gender);
                setHeight(data.Height);
                setWeight(data.Weight);
                setAge(data.Age);
                setAllergies(data.Allergies || []);
                setChronicDiseases(data.ChronicDiseases || []);
                setDocExists(true);
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while fetching your details.");
        }
    };

    const handleSubmit = async () => {
        if (!uid) {
            toast.error("You must be logged in to submit details.");
            return;
        }

        try {
            const userDocRef = doc(db, "Demographics", uid);
            const userDoc = await getDoc(userDocRef);

            const data = {
                Name: name1,
                Gender: gender1,
                Height: height1,
                Weight: weight1,
                Age: age1,
                Allergies: allergies,
                ChronicDiseases: chronicDiseases
            };

            if (userDoc.exists()) {
                await setDoc(userDocRef, data, { merge: true }); // Merge updates existing fields without overwriting the entire document
                toast.success("Details updated successfully!");
            } else {
                await setDoc(userDocRef, data);
                toast.success("Details submitted successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred while submitting your details.");
        }
    };

    return (
        <div className=" ">
            <div className="">
            <div className='pt-[5vh] font-semibold text-3xl text-[#] '>Profile Details</div>
            <div className="font-medium flex flex-col gap-2 mt-[5vh]  border px-[40vh] rounded-sm  py-[5vh] ">
        <div className="flex gap-4 items-center">
            <label className="w-24">Name: </label>
            <input placeholder={name1 ? name1 : "name"} className="border p-2 rounded w-full" aria-label="name" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex gap-4 items-center">
            <label className="w-24">Age: </label>
            <input placeholder={age1 ? age1 : "age"} type='number' className="border p-2 rounded w-full" aria-label="age" onChange={(e) => setAge(Number(e.target.value))} />
        </div>
        <div className="flex gap-4 items-center">
            <label className="w-24">Weight: </label>
            <input placeholder={weight1 ? weight1 : "weight (in kgs)"} className="border p-2 rounded w-full" type='number' aria-label="weight" onChange={(e) => setWeight(Number(e.target.value))} />
        </div>
        <div className="flex gap-4 items-center">
            <label className="w-24">Height: </label>
            <input placeholder={height1 ? height1 : "height (in cms)"} className="border p-2 rounded w-full" type='number' aria-label="height" onChange={(e) => setHeight(Number(e.target.value))} />
        </div>
        <div className="flex gap-4 items-center">
            <label className="w-24">Gender: </label>
            <input placeholder={gender1 ? gender1 : "gender"} className="border p-2 rounded w-full" aria-label="gender" onChange={(e) => setGender(e.target.value)} />
        </div>
        <button className="bg-green-500 text-white mt-6 w-full rounded p-2 hover:bg-green-600 transition duration-200" onClick={handleSubmit}>{docExists ? "Update Details" : "Submit Details"}</button>
    </div>
    <div className='flex justify-between items-center w-full mt-8'>
        <div className='text-2xl font-bold'>Chronic Diseases</div>
        <button
            id="dropdownDefaultButton"
            data-dropdown-toggle="dropdown"
            onClick={toggleDropdown}
            className="text-2xl font-bold bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200" type="button">+
        </button>
        <div id="dropdown" className={`z-10 ${dropdownVisible ? '' : 'hidden'} bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}>
            <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownDefaultButton">
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleAddChronicDisease('Diabetes')}>Diabetes</a>
                </li>
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleAddChronicDisease('Heart Disease')}>Heart Disease</a>
                </li>
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleAddChronicDisease('Hypertension')}>Hypertension</a>
                </li>
                <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100" onClick={() => handleAddChronicDisease('Obesity')}>Obesity</a>
                </li>
            </ul>
        </div>
    </div>
    <div className='border border-gray-300 p-4 mt-4 w-full rounded'>
        <ul>
            {chronicDiseases.map((disease, index) => (
                <li key={index} className='text-lg'>{disease}</li>
            ))}
        </ul>
    </div>
    <div className='flex items-center justify-between w-full mt-8'>
        <div className='text-2xl font-bold'>Allergies</div>
        {allergyToggle ?
            <div className='flex items-center'>
                <input
                    placeholder='Enter Food Item'
                    value={allergyInput}
                    onChange={handleAllergyInputChange}
                    aria-label='allergy'
                    className='bg-gray-100 px-2 rounded-lg border border-black'
                />
                <button onClick={handleAddAllergy} className='ml-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200'>Add</button>
            </div>
            :
            <button className='text-2xl font-bold bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-200' onClick={handleAllergyToggle}>+</button>
        }
    </div>
    <div className='border border-gray-300 p-4 mt-4 w-full rounded'>
        <ul>
            {allergies.map((allergy, index) => (
                <li key={index} className='text-lg'>{allergy}</li>
            ))}
        </ul>
    </div>
</div>
        </div>
    );
}

export default Profile;