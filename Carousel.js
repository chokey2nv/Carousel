import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import { Button, IconButton, Typography, Slide } from '@material-ui/core';
import { ArrowRightAlt, ArrowLeft, ArrowRight } from '@material-ui/icons';
import classNames from 'classnames';
import { setTimeout } from 'timers';
const style = theme => ({
    root: {
        position : "relative",
        height : "15cm",
        width : "100vw",
    },
    overlay : {
        display : "flex",
        position : "absolute",
        top : 0,
        left : 0,
        height : "100%",
        width : "100%",
        backgroundColor : "#80808040",
        justifyContent : "center",
        zIndex : 100,
    },
    slider : {
        display : "flex",
        width : "100%",
        height : "100%", 
        overflow : "hidden",
    },
    sliderContainer : { 
        position : "relative",
        width : "auto", 
        display : "flex",
        transition : "right 1s",
    },
    sideSliderContainer : {
        display : "flex",
        width : "100%",
        height : "100%", 
        overflow : "hidden",
        position : "absolute", 
        transition : "right 1s, zIndex 3s"
    },
    grow : {
        display : "flex",
        flexGrow : 1,
    },
    textHeader : {
        fontFamily: "cursive",
        fontWeight: 800,
        color: "white",
    },
    textBody : {
        fontFamily: "cursive",
        fontWeight: "bold",
        color: "white",
    }
})
class _Carousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex : 0,
            windowWidth : window.innerWidth,
            aboutToChange : false,
        }
        this.interval = this.props.interval || 10000
    }
    componentDidMount() {
        this.autoSlide();
        window.addEventListener("resize", this.listener)
    }
    listener = ()=>{
        this.setState({windowWidth : window.innerWidth});
    };
    componentWillUnmount() {
        window.removeEventListener("resize", this.listener);
        clearInterval(this.runningInterval);
        clearInterval(this.sliderTimer);
    }
    
    autoSlide(){
        this.runningInterval = setInterval(()=>{
            this.next();
        }, this.interval)
    }
    prev(){
        this.setState(({activeIndex})=>{
            return ({activeIndex : --activeIndex})
        });
    }
    next(){
        const {items} = this.props;
        this.setState({aboutToChange : true});
        this.sliderTimer = setTimeout(()=>{
            this.setState(
                ({activeIndex})=>{
                    return ({
                        activeIndex : items && activeIndex === items.length -1 ? 0 : ++activeIndex,
                        aboutToChange : false,
                    })
                }
            );
        }, this.interval);
    }
    render() {
        const {
            classes, baseUrl,
            items,
        } = this.props;
        const {
            windowWidth, activeIndex, aboutToChange
        } = this.state;
        return (
            <div {...this.props.commonProps} className={classes.root}>
                {!this.props.hideOverlay && 
                <div className={classes.overlay} 
                    {...this.props.commonProps}>
                    {activeIndex !== 0 && <IconButton onClick={this.prev.bind(this)}>
                        <ArrowLeft fontSize="large"/>
                    </IconButton>}
                    <div className={classes.grow}>
                        {items && items[activeIndex] ? 
                            <div style={{
                                padding : 20,
                                display : "flex",
                                flexDirection :"column",
                                justifyContent : "center",
                                height : "100%"
                            }} className={classNames("animated", aboutToChange ? "zoomOut" : "zoomIn")}>
                                <Typography className={classes.textHeader} component="strong" variant="h4" paragraph>{items[activeIndex].header}</Typography>
                                <Typography className={classes.textBody} variant="h5" paragraph>{items[activeIndex].body && items[activeIndex].body[0]}</Typography>
                            </div>
                            : null}
                    </div>
                    {items && activeIndex !== items.length - 1 && <IconButton onClick={this.next.bind(this)}>
                        <ArrowRight fontSize="large"/>
                    </IconButton>}
                </div>}
                <div ref="slider" className={classes.sideSliderContainer} 
                style={{
                    zIndex : activeIndex === 0 ? 100 : -1,                   
                }}>
                    {items && <img 
                        style={{height : "100%", width : windowWidth}} 
                        src={items[0] && (baseUrl ? baseUrl + items[0].src : items[0].src)} 
                        title={items[0] && items[0].title}/>}
                </div>
                <div ref="slider" className={classes.slider}>
                    <div ref="sliderContainer" className={classes.sliderContainer}
                        style={{
                            right : (windowWidth * activeIndex)
                        }}>
                        {items && items.map((item, index)=>{                            
                            return <img 
                                key={index}
                                style={{height : "100%", width : windowWidth}} 
                                src={baseUrl ? baseUrl + item.src : item.src} 
                                title={item.title}/>
                        })}
                    </div>    
                </div>
            </div>
        );
    }
}
_Carousel.propTypes = {
    classes : PropTypes.object.isRequired,
    items : PropTypes.array,
    baseUrl : PropTypes.string,
    hideOverlay : PropTypes.bool,
    interval : PropTypes.number,
    commonProps : PropTypes.object,
};
export const Carousel = withStyles(style)(_Carousel);