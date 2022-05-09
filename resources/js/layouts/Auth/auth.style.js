import React from "react";
import {experimentalStyled as styled} from "@mui/material/styles";
import Page from "components/Page";
import {Card, Stack} from "@mui/material";
import BTC from "./icons/BTC.svg";
import ETH from "./icons/ETH.svg";
import LTC from "./icons/LTC.svg";
import DASH from "./icons/DASH.svg";
import Particles from "react-tsparticles";

export const StyledPage = styled(Page)(({theme}) => ({
    [theme.breakpoints.up("md")]: {display: "flex"}
}));

export const BaseSectionCard = styled(Card)(({theme}) => ({
    width: "100%",
    position: "relative",
    maxWidth: 464,
    margin: theme.spacing(2, 0, 2, 2),
    padding: theme.spacing(15, 5)
}));

export const ContentStyle = styled("div")(({theme}) => ({
    maxWidth: 480,
    margin: "auto",
    padding: theme.spacing(12, 0),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "100vh"
}));

export const StyledParticles = styled(Particles)({
    width: "100%",
    position: "absolute",
    height: "100%",
    left: 0,
    top: 0,
    zIndex: 1,
    "& canvas": {
        position: "relative !important"
    }
});

const StyledStack = styled(Stack)({
    position: "relative",
    zIndex: 3
});

const SectionCard = ({children, ...props}) => {
    return (
        <BaseSectionCard {...props}>
            <StyledParticles
                options={{
                    particles: {
                        number: {
                            density: {
                                enable: false
                            },
                            value: 4
                        },
                        reduceDuplicates: true,
                        collisions: {
                            enable: true
                        },
                        move: {
                            enable: true,
                            outMode: "out",
                            speed: 1,
                            straight: false
                        },
                        opacity: {
                            value: 0.15
                        },
                        shape: {
                            type: "image",
                            images: [
                                {src: BTC, height: 20, width: 20},
                                {src: ETH, height: 20, width: 20},
                                {src: DASH, height: 20, width: 20},
                                {src: LTC, height: 20, width: 20}
                            ]
                        },
                        size: {
                            random: false,
                            value: 30
                        }
                    },
                    interactivity: {
                        detectsOn: "canvas"
                    },
                    detectRetina: true
                }}
            />

            <StyledStack justifyContent="center">{children}</StyledStack>
        </BaseSectionCard>
    );
};

export {SectionCard};
