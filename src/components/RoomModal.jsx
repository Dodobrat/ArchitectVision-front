import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Card from "./ui/Card";
import {addRoom, clearRoomMessages, closeRoomModal, updateRoom} from "../actions/roomActions";

const RoomModal = ({rooms: {currentRoom, success, error}, addRoom, closeRoomModal, clearRoomMessages, updateRoom}) => {

    const closeModal = () => {
        closeRoomModal();
    };

    useEffect(() => {
        const detectClicked = e => {
            if (e.target.classList.contains("modal-overlay")) {
                closeRoomModal();
            }
        };
        window.addEventListener('click', detectClicked);
        return () => {
            window.removeEventListener('click', detectClicked);
        };
    });

    const [formValues, setFormValues] = useState({
        title: currentRoom?.title ?? "",
        model: ""
    });

    const onChange = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    };

    const onFileChange = e => {
        setFormValues({...formValues, [e.target.name]: e.target.files[0]});
    };

    useEffect(() => {
        if (success.length > 0) {
            closeRoomModal();
        }
        if (error.length > 0) {
            console.log(error);
        }
        //eslint-disable-next-line
    }, [success, error]);

    const onSubmit = e => {
        e.preventDefault();
        const inputValues = new FormData();
        inputValues.append('title', formValues.title);
        inputValues.append('model', formValues.model);
        if (currentRoom) {
            updateRoom(currentRoom.id, inputValues).then(() => clearRoomMessages());
        } else {
            addRoom(inputValues).then(() => clearRoomMessages());
        }
    };

    return (
        <div className="modal-overlay">
            <Card className="modal"
                  header={`${currentRoom ? "Update" : "Create"} Room`}
                  dismissible={<button type="button" onClick={closeModal}>
                      <i className="fas fa-times"/>
                  </button>}>

                <form onSubmit={onSubmit}>
                    {error && error[0]}
                    <label htmlFor="title">Title</label>
                    <input type="text"
                           name="title"
                           id="title"
                           defaultValue={formValues.title}
                           onChange={onChange}
                           className="form-input"/>
                    <label htmlFor="model">3D Model</label>
                    <input type="file"
                           name="model"
                           id="model"
                           defaultValue={formValues.model}
                           onChange={onFileChange}
                           className="form-input"/>
                    {currentRoom &&
                    <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={currentRoom.model?.replace('./files/', 'http://localhost:5000/')}>
                        <button>Download File</button>
                    </a>
                    }
                    <input type="submit" className="submit"/>
                </form>

            </Card>
        </div>
    );
};

RoomModal.propTypes = {
    closeRoomModal: PropTypes.func,
};

const mapStateToProps = state => ({
    rooms: state.rooms
});

export default connect(mapStateToProps, {
    closeRoomModal,
    addRoom,
    clearRoomMessages,
    updateRoom
})(RoomModal);
