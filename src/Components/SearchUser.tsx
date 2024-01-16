import {useState, useEffect, useRef} from "react";
import userData from '../Data/userData.json'
import { User } from "../userInterface";

export const SearchUser = () => {

    const [isInputFocused, setIsInputFocused] = useState(true);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [availableUsers, setAvailableUsers] = useState<User[]>(userData);
    const [isFirstBackspacePress, setIsFirstBackspacePress] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleBackspace = (event: KeyboardEvent) => {
            if (event.key === 'Backspace' && inputRef.current && inputRef.current.value === '') {
                const lastSelectedUser = selectedUsers[selectedUsers.length - 1];
                if (lastSelectedUser) {
                    if (isFirstBackspacePress) {
                        setIsFirstBackspacePress(false);
                        inputRef.current.blur();
                        setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers]);
                    } else {
                        setIsFirstBackspacePress(true);
                        setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.slice(0, -1));
                        setAvailableUsers((prevAvailableUsers) => [...prevAvailableUsers, lastSelectedUser]);
                        inputRef.current.focus();
                    }
                }
            }
        };

        window.addEventListener('keydown', handleBackspace);

        return () => {
            window.removeEventListener('keydown', handleBackspace);
        };
    }, [selectedUsers, isFirstBackspacePress]);

    const handleUserClick = (user: User) => {
        setSelectedUsers((prevSelectedUsers) => {
            const updatedUsers = prevSelectedUsers.filter((u) => u.id !== user.id);
            const newSelectedUsers = [...updatedUsers, user];
            setAvailableUsers((prevAvailableUsers) => prevAvailableUsers.filter((u) => u.id !== user.id));
            setIsInputFocused(true);
            return newSelectedUsers;
        });
    };
    
    const handleClearSelection = (user: User) => {
        setSelectedUsers((prevSelectedUsers) => prevSelectedUsers.filter((u) => u.id !== user.id));
        setAvailableUsers((prevAvailableUsers) => [...prevAvailableUsers, user]);
        setIsInputFocused(true);
        
        if (selectedUsers.length === 1) {
            setIsInputFocused(false);
        } else {
            setIsInputFocused(true);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            if(selectedUsers.length === 0) 
                setIsInputFocused(false)
        }, 0)
    }


    return (
       <div>
            <div className="heading">
                <h2>Pick Users</h2>
            </div>
            <div className="searchUser">
                <div className="inputContainer">
                    <input 
                        type="text" 
                        placeholder="Add new user" 
                        onFocus={()=>setIsInputFocused(true)}
                        onBlur={handleInputBlur}
                        ref={inputRef}
                    />
                    <div className="selectedUsersContainer">
                        {selectedUsers.map((user, index) => (
                            <div 
                                key={user.id} 
                                className={`selectedUser ${index === selectedUsers.length - 1 ? 'highlight' : ''}`}
                                >
                                <img className="selectedUserImage" src={user.image} alt={user.name} />
                                <span className="selectedUserName">{user.name}</span>
                                <span className="clearSelection" onClick={() => handleClearSelection(user)}>X</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
                {
                    isInputFocused && (
                    <div className="userList">
                        {availableUsers.map((user) => (
                            <div 
                            key={user.id} 
                            className="userListItem"
                            onClick={() => handleUserClick(user)}
                            >
                                <img src={user.image} alt={user.name} />
                                <h5>{user.name}</h5>
                                <p>{user.email}</p>
                            </div>
                        ))}
                    </div>
                )}
       </div>
    );
}
