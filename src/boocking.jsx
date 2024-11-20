import React, { useEffect, useState, useRef } from 'react'
import './sass/boocking/boocking.scss'
import moment from 'moment';
import Ticket from './ticket';
import { useParams } from 'react-router-dom';
import Swal from "sweetalert2";

function Boocking() {

    const { id, name, vicinity, rating } = useParams()

    useEffect(() => {
        GenerateWeek();
    }, [1])

    const [phase, setPhase] = useState(1);
    const [state, setState] = useState({
        currentDay: moment(),
        dayAfterWeek: moment(),
        week: [],
        data: {
            rooms: [],
            p_adult: 500,
            n_days: 1,
            p_child: 0,
            hotel_id: id,
            hotel_name: name,
            vicinity,
            rating,
        },
        numberClick: 0,
        countNext: 0,
        validate: null,
    });
    const parentRef = useRef();

    console.log(vicinity, rating);


    async function GenerateWeek() {
        var weekStartingToday = Array.from({ length: 7 }, (_, i) =>
            state.currentDay.clone().add(i, 'days').format("YYYY-MM-DD"),
        );
        setState(prevState => ({
            ...prevState,
            dayAfterWeek: moment().add(7, 'days'),
            week: weekStartingToday,
        }));
    }

    const removeClasses = () => {
        const parentElem = Array.from(parentRef.current.children)
        parentElem.map((e) => {
            Array.from(e.children).map((se) => {
                se.classList.remove('active');
            })
        })
    }

    const NextWeek = () => {

        removeClasses();

        var weekStartingToday = Array.from({ length: 7 }, (_, i) =>
            state.dayAfterWeek.clone().add(i, 'days').format("YYYY-MM-DD"),
        );
        setState(prevState => ({
            ...prevState,
            week: weekStartingToday,
            dayAfterWeek: moment(state.dayAfterWeek).add(7, 'days'),
            countNext: state.countNext + 1
        }));
    }

    const PreviousWeek = () => {
        if (state.countNext > 0) {
            removeClasses();
            const dayAfterWeek = moment(state.dayAfterWeek).subtract(14, 'days');
            var weekStartingToday = Array.from({ length: 7 }, (_, i) =>
                dayAfterWeek.clone().add(i, 'days').format("YYYY-MM-DD"),
            );

            setState(prevState => ({
                ...prevState,
                week: weekStartingToday,
                dayAfterWeek: moment(state.dayAfterWeek).subtract(7, 'days'),
                countNext: state.countNext - 1
            }));
        }
    }

    const next = async () => {

        if (phase === 5) {
            const totalP = parseInt(state.data.p_adult / 500) + parseInt(state.data.p_child / 100);
            totalP === state.data.rooms.length && phase < 6 ? setPhase(phase + 1) : swalWorning();

        } else if (state.validate === true) {
            phase < 5 && setPhase(phase + 1)
        }

        setState((prev) => ({
            ...prev,
            validate: "empty",
        }))
        if (state.validate === null || phase < 5 && state.validate === "empty") {
            swalWorning()
        }
    }

    console.log(state.validate);


    const previous = () => {

        phase > 1 ? setPhase(phase - 1) : setPhase(phase)
    }

    const handelDate = (event) => {

        removeClasses();

        event.currentTarget.classList.toggle('active');

        setState(prev => ({
            ...prev,
            data: {
                ...prev.data,
                date: state.week[event.target.id],
                time: event.target.textContent,
            },
            validate: true,
        })
        )
        Swal.fire({
            title: "success",
            text: `Appointment set for the ${event.target.textContent} of ${state.week[event.target.id]}`,
            icon: "success",
            confirmButtonText: "OK",
            confirmButtonColor: "#3D3D3D",
            cancelButtonColor: "#6e6e6e",
        })
    }


    const validation = (name, value) => {
        if (name == "telephone") {
            const regex = /^\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/;
            return regex.test(value);
        } else if (name == "email") {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(value);
        } else {
            return value.trim() !== "";
        }
    }


    const handelChangeData = (event) => {
        const { name, value } = event.target;

        const validate = validation(name, value);

        if (validate) {
            setState((prev) => ({
                ...prev,
                validate: true,
            }))
        } else {
            setState((prev) => ({
                ...prev,
                validate: false,
            }))
        }

        setState((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: value,
            },
        }))
    }

    const addNumber = (event) => {
        const { name } = event.target;
        let plus = 1

        if (name === "p_adult") plus = 500;
        else if (name === "p_child") plus = 100;

        setState((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: (prev.data[name]) + plus,
            }
        }))
    }

    const minus = (name) => {
        let minu = 1

        if (name === "p_adult") minu = 500;
        else if (name === "p_child") minu = 100;

        setState((prev) => ({
            ...prev,
            data: {
                ...prev.data,
                [name]: (prev.data[name]) - minu,
            }
        }))
    }

    const minuNumber = (event) => {

        
        const { name } = event.target;
        const person_length = state.data.p_adult / 500 + state.data.p_child / 100;
        
        if (name === 'p_adult' && state.data.p_adult > 500) {
            minus(name);
            person_length <= state.data.rooms.length &&  state.data.rooms.splice(person_length - 1);            ;
        } else if (name === 'n_days' && state.data.n_days > 1) {
            minus(name);
        } else if (name === 'p_child' && state.data.p_child > 0) {
            minus(name);
            person_length <= state.data.rooms.length &&  state.data.rooms.splice(person_length - 1);            ;
        }
    }

    const rooms = Array.from({ length: 20 }, (r, i) => i + 1);
    // const ratings = Array.from({ length:  }, (r, i) => i + 1);

    const hndelRoom = (index) => {

        setState(prev => {

            const roomsSet = new Set(prev.data.rooms);

            if (roomsSet.has(index)) {
                roomsSet.delete(index);
            } else {
                roomsSet.add(index);
            }

            return ({
                ...prev,
                data: {
                    ...prev.data,
                    rooms: Array.from(roomsSet)
                }
            })
        })
    }

    const swalWorning = () => {
        Swal.fire({
            title: "Worning",
            text: `Try to fill in the entries`,
            icon: "warning",
            confirmButtonText: "OK",
            confirmButtonColor: "#3D3D3D",
        })
    }

    return (
        <div className='boocking'>
            <form action="">
                {
                    phase === 1 ?
                        <>
                            <div className='form'>
                                <>
                                    <div>
                                        <p htmlFor="">Nom complet <span>*</span></p>
                                        <input type="text" name='name' value={state.data?.name} onChange={handelChangeData} placeholder='Taper votre réponse ici' />
                                        <p className='validation'>
                                            {
                                                <button
                                                    className={`message ${state.validate === true ? 'show' : ''}`}
                                                    style={{
                                                        fontSize: "15px",
                                                        fontWeight: 400,
                                                        transition: "0.5s",
                                                        padding: "1px 15px",
                                                        borderRadius: "5px",
                                                        color: "white",
                                                        backgroundColor: "#3D3D3D",
                                                        border: "none",
                                                        padding: "4px 20px",
                                                    }}
                                                    onClick={next}
                                                    type='button'
                                                >
                                                    OK
                                                </button>
                                            } {
                                                <>
                                                    <span className={`message ${state.validate === true ? 'show' : ''}`} style={{ color: "#008f18", fontSize: "15px", fontWeight: 400, }}>Name is valid</span>
                                                    <span className={`message ${state.validate === false ? 'show' : ''}`} style={{ color: "#d80000", fontSize: "15px", fontWeight: 400, }}>Name not entered</span>
                                                </>
                                            }

                                        </p>
                                    </div>
                                </>
                            </div>
                        </>

                        :
                        phase === 2 ?
                            <div className='form'>
                                <div>
                                    <p htmlFor="">Telephone <span>*</span></p>
                                    <input type="text" name='telephone' value={state.data?.telephone ? state.data.telephone : ""} onChange={handelChangeData} placeholder='Taper votre telephone' />
                                    <p className='validation'>
                                        {
                                            <button
                                                className={`message ${state.validate === true ? 'show' : ''}`}
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: 400,
                                                    transition: "0.5s",
                                                    padding: "1px 15px",
                                                    borderRadius: "5px",
                                                    color: "white",
                                                    backgroundColor: "#3D3D3D",
                                                    border: "none",
                                                    padding: "4px 20px",

                                                }}
                                                onClick={next}
                                                type='button'
                                            >
                                                OK
                                            </button>
                                        } {
                                            <>
                                                <span className={`message ${state.validate === true ? 'show' : ''}`} style={{ color: "#008f18", fontSize: "15px", fontWeight: 400 }}>Phone is valid</span>
                                                <span className={`message ${state.validate === false ? 'show' : ''}`} style={{ color: "#d80000", fontSize: "15px", fontWeight: 400 }}>Phone no valid</span>
                                            </>
                                        }
                                    </p>

                                </div>
                            </div>
                            :
                            phase === 3 ?
                                <div className='form'>
                                    <div>
                                        <p htmlFor="">Email</p>
                                        <input type="email" name='email' value={state.data?.email ? state.data.email : ""} onChange={handelChangeData} placeholder='Taper votre email' />
                                        <p className='validation'>
                                            {
                                                <button
                                                className={`message ${state.validate === true ? 'show' : ''}`}
                                                    style={{
                                                        fontSize: "15px",
                                                        fontWeight: 400,
                                                        transition: "0.5s",
                                                        padding: "1px 15px",
                                                        borderRadius: "5px",
                                                        color: "white",
                                                        backgroundColor: "#3D3D3D",
                                                        border: "none",
                                                        padding: "4px 20px",

                                                    }}
                                                    onClick={next}
                                                    type='button'
                                                >
                                                    OK
                                                </button>

                                            } {
                                                <>
                                                    <span className={`message ${state.validate === true ? 'show' : ''}`} style={{ color: "#008f18", fontSize: "15px", fontWeight: 400 }}>Email is valid!</span>
                                                    <span className={`message ${state.validate === false ? 'show' : ''}`} style={{ color: "#d80000", fontSize: "15px", fontWeight: 400 }}>Email address no valid.</span>
                                                </>
                                            }
                                        </p>
                                    </div>
                                </div>
                                :
                                phase === 4 ?
                                    <div className='form'>
                                        <div className='boocking_date'>
                                            <div className="header">
                                                <button type='button' onClick={PreviousWeek} className='left'><i class="fa-solid fa-circle-arrow-left"></i></button>
                                                <div className='header_date'>
                                                    <div>
                                                        {state.week.map(d =>
                                                            <p>{moment(d).format("dddd")}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        {state.week.map(w =>
                                                            <label key={w}>{w}</label>
                                                        )}
                                                    </div>
                                                </div>
                                                <button type='button' onClick={NextWeek} className='right'><i class="fa-solid fa-circle-arrow-right"></i></button>
                                            </div>
                                            <div className="body" ref={parentRef}>
                                                {state.week.map((_, index) =>
                                                    <div>
                                                        <button type='button' id={index} onClick={handelDate}>Morning</button>
                                                        <button type='button' id={index} onClick={handelDate}>Evening</button>
                                                        <button type='button' id={index} onClick={handelDate}>Afternoon</button>
                                                        <button type='button' id={index} onClick={handelDate}>Night</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {state.validate === false
                                            ?
                                            swalWorning()
                                            :
                                            <></>
                                        }
                                    </div>
                                    :
                                    phase === 5 ?
                                        <>
                                            <div className='demands'>
                                                <div>
                                                    <div className="adult">
                                                        <button name='p_adult' type='button' onClick={minuNumber}>-</button>
                                                        <div>
                                                            <i class="fa-solid fa-person"></i>
                                                            <div>{(state.data.p_adult) / 500}</div>
                                                        </div>
                                                        <button name='p_adult' type='button' onClick={addNumber}>+</button>
                                                    </div>
                                                    <div>
                                                        <p>Dult : 500 DH</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="number_days">
                                                        <button type='button' name='n_days' onClick={minuNumber}>-</button>
                                                        <div>
                                                            <i class="fa-solid fa-calendar-day"></i>
                                                            <div>{parseInt(state.data.n_days)}</div>
                                                        </div>
                                                        <button type='button' name='n_days' onClick={addNumber}>+</button>
                                                    </div>
                                                    <div>
                                                        <p>Number of days</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="child">
                                                        <button type='button' name='p_child' onClick={minuNumber}>-</button>
                                                        <div>
                                                            <i class="fa-solid fa-child"></i>
                                                            <div>{(state.data.p_child) / 100}</div>
                                                        </div>
                                                        <button type='button' name='p_child' onClick={addNumber}>+</button>
                                                    </div>
                                                    <p>Child : 100 DH</p>
                                                </div>

                                            </div>

                                            <div className="rooms">
                                                {rooms.map((r, i) =>
                                                    <div id={i} className='checkbox' style={{ background: (state.data.rooms?.find(e => e === (i + 1)) ? '#3D3D3D' : ''), color: (state.data.rooms?.find(e => e === (i + 1)) ? '#FFFF' : '') }} onClick={() => hndelRoom(i + 1)}>
                                                        <div>
                                                            {
                                                                state.data.rooms?.find(e => e === (i + 1)) ? <i class="fa-solid fa-person-booth"></i> : i + 1
                                                            }
                                                        </div>
                                                        <span class="checkmark"></span>
                                                    </div>
                                                )}
                                            </div>
                                            <p style={{ display: "flex", justifyContent: "center" }}>Totale : {(state.data.p_adult + state.data.p_child) * (state.data.n_days)} DH</p>
                                        </>
                                        :
                                        phase === 6 ?
                                            <>
                                                <Ticket data={state.data} />
                                            </>
                                            :
                                            <></>
                }
            </form>
            <div className='buttons'>
                <button type='button' onClick={previous}>previous</button>
                <button type='button' onClick={next}>next</button>
            </div>
        </div>
    )
}

export default Boocking