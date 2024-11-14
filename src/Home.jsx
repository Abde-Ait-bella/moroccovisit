import React, { useEffect, useState, useRef } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import logoSvg from '../src/assets/svg/logo.svg';
import marrakechImg from '../src/assets/images/marrakech.jpeg'
import TaroudantImg from '../src/assets/images/Taroudant.webp'
import AgadirImg from '../src/assets/images/agadir.jpeg'
import Facebooksvg from '../src/assets/svg/facebook.svg'
import twittersvg from '../src/assets/images/twetter.png'
import Instagramsvg from '../src/assets/svg/instagram.svg'
import Llocation from '../src/assets/svg/llocation.svg';
import place_1_img from '../src/assets/images/place-1.jpg'
import place_2_img from '../src/assets/images/place-2.jpg'
import place_3_img from '../src/assets/images/place-3.png'
import place_4_img from '../src/assets/images/place-4.jpg'
import place_5_img from '../src/assets/images/place-5.jpg'
import place_6_img from '../src/assets/images/place-6.jpg'
import place_7_img from '../src/assets/images/place-7.jpg'
import place_8_img from '../src/assets/images/place-8.jpg'
import aboutUs_img from '../src/assets/images/aboutUs.jpg'
import HotelTaroudat_img from '../src/assets/images/HotelTaroudat.jpg'
import HotelAgadir_img from '../src/assets/images/HotelAgadir.jpg'
import HotelMarrakech_img from '../src/assets/images/HotelMarrakech.jpg'
import partner_1 from '../src/assets/svg/Partner-1.svg';
import partner_2 from '../src/assets/svg/Partner-2.svg';
import partner_3 from '../src/assets/svg/Partner-3.svg';
import partner_4 from '../src/assets/svg/Partner-4.svg';
import guillemets_svg from "../src/assets/svg/“.svg";
import PhotoAvis_1 from "../src/assets/svg/PhotoAvis1.svg";
import PhotoAvis_2 from "../src/assets/svg/PhotoAvis2.svg";
import PhotoAvis_3 from "../src/assets/svg/PhotoAvis3.svg";
import footer_logo from "../src/assets/svg/footerLogo.svg";
import instagramIcone from "../src/assets/svg/footerIcone.svg";
import facebookIcone from "../src/assets/svg/footerIcone2.svg";
import twitterIcone from "../src/assets/svg/footerIcone3.svg";
import youtubeIcone from "../src/assets/svg/footerIcone4.svg";
import { GoogleMap, InfoWindow, Marker, StandaloneSearchBox, useJsApiLoader } from '@react-google-maps/api';
import customIcon from './assets/images/hotel_marker.png';
import hotel_logo from './assets/images/hotel_logo.png';
import { useInView } from "react-intersection-observer";

const libraries = ["places"];

function Home() {


    const { ref: activitesRef, inView: activitesInView } = useInView({ triggerOnce: false });    
      
    const [defaultZoom, setDefaultZoom] = useState(1);
    const [selectedPlace, setSelectedPlace] = useState({
        location: {
            lat: 31.7917,
            lng: -7.0926
        }
    });
    const [activeMarker, setActiveMarker] = useState(null);
    const [dataActive, setDataActive] = useState(null);
    const [typeImg, setTypeImg] = useState(2);
    const [viewNav, setViewNav] = useState(false);

    const [state, setState] = useState({
        hotels: [],
    })

    useEffect(()=>{
        setViewNav(!activitesInView);
    },[activitesInView])

    const inputRef = useRef();

    console.log(viewNav);
    

    const handelTypeImg = (type) => {
        setTypeImg(type)
    }

    const containerStyle = {
        width: '99%',
        height: '100vh',
    }

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBWF4GwzK9NQfaHWgXzpyYzzOZUSsxt824',
        libraries
    });

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    useEffect(() => {
        AOS.init();
        setTimeout(() => {
            setDefaultZoom(5)
        }, [1000])
    }, [])


    const handleOnPlacesChanged = () => {
        let address = inputRef?.current.getPlaces();
        const place = address[0];
        setDefaultZoom(9)
        if (address && address.length > 0) {
            setSelectedPlace({
                name: place.name,
                address: place.formatted_address,
                location: {
                    lat: place.geometry.location?.lat(),
                    lng: place.geometry.location?.lng(),
                },
            });
            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            searchHotels(location);
            setDataActive(location);
        }
    }

    const searchHotels = (location) => {
        const service = new window.google.maps.places.PlacesService(map);

        const request = {
            location: new window.google.maps.LatLng(location.lat, location.lng),
            radius: '5000',
            type: ['lodging'],
        };

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setState({
                    hotels: results
                })
            } else {
                console.error('PlacesService nearbySearch failed:', status);
            }
        });
    };

    const center = {
        lat: parseInt(selectedPlace?.location?.lat),
        lng: parseInt(selectedPlace?.location?.lng)
    }

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", backgroundColor: "", display: "flex", justifyContent: "center" }}
                onClick={onClick}
            >Next</div>
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", backgroundColor: "", display: "flex", justifyContent: "center" }}
                onClick={onClick}
            >Previous</div>
        );
    }

    // Handle marker click to open InfoWindow
    const handleMarkerClick = (hotel) => {
        setActiveMarker(hotel?.place_id);
    };

    const handleInfoWindowClose = () => {
        setActiveMarker(null);
    };

    const settings =
    {
        slidesToShow: 4,
        slidesToScroll: 1,
        // autoplay: true,
        // autoplaySpeed: 2000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        // prevArrow: '<button type="button" class="slick-prev">back</button>',
        // nextArrow: '<button type="button" class="slick-next">next</button>',

        responsive: [
            {
                breakpoint: 1780,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    prevArrow: false,
                    nextArrow: false,
                }
            },
            {
                breakpoint: 1350,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    vArrow: false,
                    nextArrow: false,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    vArrow: false,
                    nextArrow: false,
                }
            }]
    }
    return (
        <div>
            <nav class={`nav ${!activitesInView && "background"}`}>
                <ul class="nav__left">
                    <li>
                        <a href="#">
                            <img src={logoSvg} alt="" />
                        </a>
                    </li>
                </ul>
                <ul class="nav__center">
                    <li><a href="#slider">HOME</a></li>
                    <li><a href="#activites">PLACES</a></li>
                    <li><a href="#aboutUs">ABOUT</a></li>
                    <li><a href="#section-hotels">HOTELS</a></li>
                </ul>
                <div class="nav__right">
                    <div class="navberger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
            <div class="menumobil">
                <ul>
                    <li><a href="#slider">HOME</a></li>
                    <li><a href="#activites">PLACES</a></li>
                    <li><a href="#aboutUs">ABOUT</a></li>
                    <li><a href="#section-hotels">HOTELS</a></li>
                </ul>
            </div>
            <section id="slider" ref={activitesRef} class="slider">
                <div class="backgrounds">
                    <img className={`${typeImg === 1 ? "visible" : ""}`} src={AgadirImg} alt="" />
                    <img className={`${typeImg === 2 ? "visible" : ""}`} src={marrakechImg} alt="" />
                    <img className={`${typeImg === 3 ? "visible" : ""}`} src={TaroudantImg} alt="" />
                </div>
                <ul class="slider__icons">
                    <li><a href="https://www.facebook.com/abdessamade.aitbella">
                        <img src={Facebooksvg} alt="" />
                    </a>
                    </li>
                    <li><a href="https://twitter.com/"><img src={twittersvg} alt="" /></a></li>
                    <li><a href="#">
                        <img src={Instagramsvg} alt="" />
                    </a></li>
                </ul>
                <div class="slider__content">
                    <div class="slider__content-soustitre">
                        <label for="">explore</label>
                    </div>
                    <div class="slider__content-titre">
                        <label for="">Morocco</label>
                    </div>
                </div>
                <div class="slider__villes" >
                    <div class="slider__ville" onClick={() => handelTypeImg(1)}>
                        <div class="slider__ville__content">
                            <label for="">Agadir</label>
                            <img src={Llocation} alt="" />
                            <p for="">Plan a trip</p>
                        </div>
                    </div>
                    <div class="slider__ville" onClick={() => handelTypeImg(2)}>
                        <div class="slider__ville__content">
                            <label for="">Marrakech</label>
                            <img src={Llocation} alt="" />
                            <p for="">Plan a trip</p>
                        </div>
                    </div>
                    <div class="slider__ville" onClick={() => handelTypeImg(3)}>
                        <div class="slider__ville__content">
                            <label for="">Taroudant</label>
                            <img src={Llocation} alt="" />
                            <p for="">Plan a trip</p>
                        </div>
                    </div>
                    <div class="slider__ville__content-3">

                    </div>
                </div>
            </section>
            <section id="activites" class="activites" data-aos="fade-right">
                <div class="section-title">
                    <h3 class="subtitle">HUNDREDS OF</h3>
                    <h2 class="tilte">Places to visit</h2>
                </div>
                <div class="wrapper">
                    <div class="container">
                        <Slider {...settings} class="row carousel">
                            <div class="card">
                                <img src={place_1_img} alt="img" />
                                <div className="info_card">
                                    <label for="">Ait Benhaddou</label>
                                    <span>8 activites</span>
                                </div>
                            </div>
                            <div class="card">
                                <img src={place_2_img} alt="img" />
                                <label for="">CASA</label>
                                <span>512 activites</span>
                            </div>
                            <div class="card">
                                <img src={place_3_img} alt="img" />
                                <label for="">Taroudant</label>
                                <span>20 activites</span>
                            </div>
                            <div class="card">
                                <img src={place_4_img} alt="img" />
                                <label for="">SAHARA</label>
                                <span>23 activites</span>
                            </div>
                            <div class="card">
                                <img src={place_5_img} alt="img" />
                                <label for="">Meknès</label>
                                <span>512 activites</span>
                            </div>
                            <div class="card">
                                <img src={place_6_img} alt="img" />
                                <label for="">SAFI</label>
                                <span>30 activites</span>
                            </div>
                            <div class="card">
                                <img src={place_7_img} alt="img" />
                                <label for="">MARRAKECH</label>
                                <span>130 activites</span>
                            </div>
                            <div class="card">
                                <img src={place_8_img} alt="img" />
                                <label for="">CHEFCHAOUEN</label>
                                <span>34 activites</span>
                            </div>
                        </Slider>
                    </div>
                </div>
            </section>
            <section id="aboutUs" class="about-us" data-aos="fade-up">
                <div class="section-title">
                    <h3 class="subtitle">about us</h3>
                    <h2 class="tilte">Our Philosophy</h2>
                </div>
                <div class="container">
                    <div class="row about-us__content">
                        <div class="col-lg-7 col-md-12 about-us__content_img">
                            <img src={aboutUs_img} alt="about-image" />
                        </div>
                        <div class="col-lg col-md-12 about-us__content_informations">
                            <div class="about-us__content_information">
                                <h3 for="">Sustainable</h3>
                                <p>At Morocco visit, sustainability is key. We minimize our environmental impact, promote
                                    low-emission transport, and support conservation to preserve Morocco for future generations.
                                </p>
                            </div>
                            <div class="about-us__content_information">
                                <h3 for="">Fair & Share</h3>
                                <p>We work in close partnership with local communities. Your trip contributes to local
                                    employment, support for artisans, and social projects that improve the lives of locals.</p>
                            </div>
                            <div class="about-us__content_information">
                                <h3 for="">Experience</h3>
                                <p>Explorez le Maroc avec Morocco visit pour une expérience unique. Notre équipe vous
                                    offre une aventure authentique, sûre et mémorable tout en préservant la planète et en
                                    soutenant les communautés locales.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="section-hotels" class="section-hotels" data-aos="fade-up">
                <div class="section-title">
                    <h3 class="subtitle">BEAUTIES</h3>
                    <h2 class="tilte">Hotels and Appartements</h2>
                </div>
                <div class="content">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-4 col-sm-6">
                                <img src={HotelTaroudat_img} alt="" />
                                <div class="title-container">
                                    <h3 class="title">Palais Claudio Bravo</h3>
                                    <div class="rating">
                                        <span></span><span></span><span></span><span></span><span class="half"></span>
                                    </div>
                                </div>
                                <p class="price">150 DH</p>
                            </div>
                            <div class="col-lg-4 col-md-12">
                                <img src={HotelMarrakech_img} alt="" />
                                <div class="title-container">
                                    <h3 class="title">Riad Nayanour</h3>
                                    <div class="rating">
                                        <span></span><span></span><span></span><span></span><span></span>
                                    </div>
                                </div>
                                <p class="price">250 DH</p>
                            </div>
                            <div class="col-lg-4 col-sm-6">
                                <img src={HotelAgadir_img} alt="" />
                                <div class="title-container">
                                    <h3 class="title">Riu Palace Tikida</h3>
                                    <div class="rating">
                                        <span></span><span></span><span></span><span></span><span class="empty"></span>
                                    </div>
                                </div>
                                <p class="price">100 DH</p>
                            </div>
                        </div>
                        <div class="row down-hotels">
                            <div class="col-lg col-sm-12 inputs">
                                <label for="">PLACE</label>
                                {isLoaded &&
                                    <StandaloneSearchBox
                                        onLoad={(ref) => {
                                            inputRef.current = ref;
                                            console.log("StandaloneSearchBox loaded:", ref)
                                        }
                                        }
                                        onPlacesChanged={handleOnPlacesChanged}
                                    >
                                        <input useref={inputRef} type="text" placeholder="Enter place" />
                                    </StandaloneSearchBox>
                                }
                            </div>
                            <div class="col-lg-auto d-flex justify-content-sm-center  btn-search">
                                <button>SEARCH</button>
                            </div>
                        </div>
                    </div>
                </div>


                <section>
                    <div className={`map_section ${dataActive ? 'data_active' : ''}`}>
                        {
                            state.hotels.length > 0 && (
                                <div className="list_hotels">
                                    {state.hotels.map((hotel) => (
                                        <div key={hotel.place_id} class="body-card">
                                            {/* <div class="card_doc_profile"> */}
                                            <div class="doc-info-left">
                                                <div class="doctor-img">
                                                    <img src={hotel_logo} class="img-fluid" alt="hotel image" />
                                                </div>
                                                <div class="doc-info-cont">
                                                    <h4 class="doc-name">{hotel.name}</h4>
                                                    <div class="rating">
                                                        {console.log('hotel', hotel.rating)
                                                        }
                                                        {Array.from({ length: (hotel.rating) }).map((r) =>
                                                            <i key={r} class="fas fa-star filled"></i>
                                                        )}
                                                        {
                                                            (Number(hotel.rating) === hotel.rating && !Number.isInteger(hotel.rating)) ?
                                                                <i class="fa-solid fa-star-half-stroke"></i>
                                                                : <></>
                                                        }
                                                        <span style={{ marginLeft: "7px" }} class="d-inline-block average-rating">({hotel.rating})</span>
                                                    </div>
                                                    <div class="clinic-details">
                                                        <p class="doc-location">
                                                            <i class="fas fa-map-marker-alt"></i>
                                                            <span style={{ fontSize: "small", marginLeft: "6px" }}>{hotel.vicinity}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="doc-info-right">
                                                <div class="clini-infos">
                                                    <ul>
                                                        <li><i class="fa-solid fa-user-check"></i> {hotel.user_ratings_total}</li>
                                                        <li><i class="far fa-money-bill-alt"></i> 500 DH</li>
                                                    </ul>
                                                </div>
                                                <div class="clinic-booking">
                                                    <Link class="apt-btn" to={`/boocking/${hotel.place_id}/${hotel.name}/${hotel.vicinity}/${hotel.rating}`}>Boocking</Link>
                                                </div>
                                            </div>
                                            {/* </div> */}
                                        </div>
                                    ))}
                                </div>
                            )


                        }

                        {isLoaded ?
                            // <LoadScript googleMapsApiKey="AIzaSyBWF4GwzK9NQfaHWgXzpyYzzOZUSsxt824" libraries={libraries}>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                zoom={defaultZoom}
                                center={center}
                                options={{
                                    disableDefaultUI: true, // Optional: disable UI for a cleaner look
                                    zoomControl: true,      // Enable zoom control if desired
                                }}
                                onLoad={onLoad}
                                onUnmount={onUnmount}
                            >
                                {state.hotels.map((hotel) => (
                                    <Marker
                                        key={hotel.place_id}
                                        position={{
                                            lat: hotel.geometry.location.lat(),
                                            lng: hotel.geometry.location.lng(),
                                        }}
                                        title={hotel.name}
                                        icon={{
                                            url: customIcon,
                                            scaledSize: new window.google.maps.Size(40, 40),
                                        }}
                                        onClick={() => handleMarkerClick(hotel)}
                                    >
                                        {activeMarker === hotel.place_id ? (
                                            <InfoWindow onCloseClick={handleInfoWindowClose}>
                                                <div style={{ color: "#000", width: "15rem", height: "9rem", textAlign: center, marginBottom: "2px" }}>
                                                    <img style={{ height: "2.2rem", objectFit: "contain" }} src={hotel.icon} alt="" />
                                                    <p style={{ fontWeight: "bold", color: "#2D2D2D", textAlign: "center", marginBottom: "0.6rem" }}>{hotel.name}</p>
                                                    <p style={{ marginBottom: "0.3rem", fontSize: "10px" }}>{hotel.vicinity}</p>
                                                    <p style={{ color: "#ffc207", fontWeight: "bold" }}>Rating: {hotel.rating || 'N/A'}</p>
                                                    <div>
                                                        <Link to={`/boocking/${hotel.place_id}/${hotel.name}/${hotel.vicinity}/${hotel.rating}`} style={{ padding: "8px 36px", fontWeight: "bold", margin: "10px 0", borderRadius: "15px", backgroundColor: "#2D2D2D", color: "white", textDecoration: "none" }}>
                                                            Boocking
                                                        </Link>
                                                    </div>
                                                </div>
                                            </InfoWindow>
                                        )
                                            : null
                                        }
                                    </Marker>
                                ))}
                            </GoogleMap>
                            // </LoadScript>

                            :
                            <></>
                        }
                    </div>
                </section>

            </section >
            <section class="network" data-aos="fade-up">
                <div class="section-title">
                    <h3 class="subtitle">netwoek</h3>
                    <h2 class="tilte">Our Partners</h2>
                </div>
                <div class="container">
                    <div class="row network__partners">
                        <div class="col-lg col-md-6 col-sm-1">
                            <img src={partner_1} alt="" />
                        </div>
                        <div class="col-lg col-md-6 col-sm-1">
                            <img src={partner_2} alt="" />
                        </div>
                        <div class="col-lg col-md-6 col-sm-1">
                            <img src={partner_3} alt="" />
                        </div>
                        <div class="col-lg col-md-6 col-sm-1">
                            <img src={partner_4} alt="" />
                        </div>
                    </div>
                </div>
            </section>
            <section class="avis">
                <div class="container avis__contents">
                    <div class="row" data-aos="fade-up" data-aos-duration="2500">
                        <div class="content">
                            <div class="img">
                                <img src={guillemets_svg} alt="" />
                                <p>An exceptional trip with Morocco visit! Unforgettable experiences, passionate guides and a
                                    commitment to sustainability that really left an impression on us. We will definitely come
                                    back .</p>
                            </div>
                            <div class="avis__footer">
                                <label for="">Jane Cooper</label>
                                <span>Gone with friends</span>
                                <img class="photo-commentator" src={PhotoAvis_1} alt="" />
                            </div>
                        </div>
                        <div class="content">
                            <div class="img">
                                <img src={guillemets_svg} alt="" />
                                <p>Our journey with Morocco visit was an eye-opener. They have perfectly succeeded in combining
                                    adventure, comfort and respect for the environment, experience that we highly recommend! .
                                </p>
                            </div>
                            <div class="avis__footer">
                                <label for="">Alan Jackson</label>
                                <span>Gone as a couple</span>
                                <img class="photo-commentator" src={PhotoAvis_2} alt="" />
                            </div>
                        </div>
                        <div class="content">
                            <div class="img">
                                <img src={guillemets_svg} alt="" />
                                <p>My journey with Morocco visit is a very simple adventure. There is a total immersion in the
                                    Marocaine culture, with careful attention to the durability and the local communities. An
                                    experience enriching all our loved ones.</p>
                            </div>
                            <div class="avis__footer">
                                <label for="">Jane Cooper</label>
                                <span>Gone with family</span>
                                <img class="photo-commentator" src={PhotoAvis_3} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer>
                <div class="footer__logo" data-aos="fade-down">
                    <img src={footer_logo} alt="" />
                    <label for="">Morocco Visit</label>
                </div>
                <div class="container">
                    <div class="row">
                        <div class="footer__menu" data-aos="fade-right">
                            <ul class="menu">
                                <li><a href="#slider">Home</a></li>
                                <li><a href="#activites">Destinations</a></li>
                                <li><a href="#aboutUs">About Us</a></li>
                                <li><a href="#section-hotels">Hotels</a></li>
                            </ul>
                        </div>
                        <div class="container footer__line">
                            <hr />
                        </div>
                        <div class="footer__sub">
                            <div>
                                <span>© 2020 Bikart Design. All rights reserved</span>
                            </div>
                            <div class="icons">
                                <span><a href="https://www.instagram.com" ><img
                                    src={instagramIcone} alt="" /></a></span>
                                <span><a href="https://www.facebook.com" ><img
                                    src={facebookIcone} alt="" /></a></span>
                                <span><a href="https://twitter.com" ><img src={twitterIcone}
                                    alt="" /></a></span>
                                <span><a href="https://youtube.com" ><img src={youtubeIcone}
                                    alt="" /></a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
            {/* <script src="./dist/js/aos.js"></script>
            <script src="./dist/js/jquery-3.7.0.js"></script> */}
            <script type="text/javascript" src="./dist/js/slick.min.js"></script>
            <script src="./dist/js/script.js"></script>
            {/* <script>
           { AOS.init({
                easing: 'ease-in-out-sine'
            })}
        </script> */}
            {/* <script>
                {document.querySelector('.carousel').slick({
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    prevArrow: '<button type="button" class="slick-prev">back</button>',
                    nextArrow: '<button type="button" class="slick-next">next</button>',


                    responsive: [
                        {
                            breakpoint: 1780,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                infinite: true,
                                dots: true,
                                prevArrow: false,
                                nextArrow: false,
                            }
                        },
                        {
                            breakpoint: 1350,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,
                                infinite: true,
                                dots: true,
                                vArrow: false,
                                nextArrow: false,
                            }
                        },
                        {
                            breakpoint: 767,
                            settings: {
                                slidesToShow: 1,
                                slidesToScroll: 1,
                                infinite: true,
                                dots: true,
                                vArrow: false,
                                nextArrow: false,
                            }
                        }
                        // You can unslick at a given breakpoint now by adding:
                        // settings: "unslick"
                        // instead of a settings object
                    ]
                })}
            </script> */}
        </div >
    )
}

export default Home;