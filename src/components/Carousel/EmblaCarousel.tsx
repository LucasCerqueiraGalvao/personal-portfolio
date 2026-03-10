import React from "react";
import { type EmblaOptionsType } from "embla-carousel";
import { DotButton } from "./EmblaCarouselDotButton";
import { PrevButton, NextButton } from "./EmblaCarouselArrowButtons";
import useEmblaCarousel from "embla-carousel-react";
import ProjectCard from "../ProjectsSection/ProjectCard";
import { useDotButton } from "./useDotButton";
import { usePrevNextButtons } from "./usePrevNextButtons";

type Project = {
    id: string;
    slug?: string;
    title: string;
    description: string;
    techs: string[];
    image?: string;
    source?: string;
    isOffline?: boolean;
    link?: string;
};

type PropType = {
    projects: Project[];
    options?: EmblaOptionsType;
};

const EmblaCarousel: React.FC<PropType> = ({ projects, options }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel(options);

    const { selectedIndex, scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick,
    } = usePrevNextButtons(emblaApi);

    return (
        <div className="mx-auto w-full max-w-screen-xl overflow-hidden px-0 sm:px-12 selection:bg-transparent">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-2 sm:gap-6">
                    {projects.map((proj, index) => (
                        <div
                            key={index}
                            className="min-w-[calc(100%-1px)] shrink-0 sm:min-w-[60%] lg:min-w-[25%]"
                        >
                            <ProjectCard {...proj} idx={index} />
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-2 flex flex-col items-center gap-2 sm:mt-8 sm:gap-4">
                <div className="hidden gap-4 sm:flex">
                    <PrevButton
                        onClick={onPrevButtonClick}
                        disabled={prevBtnDisabled}
                    />
                    <NextButton
                        onClick={onNextButtonClick}
                        disabled={nextBtnDisabled}
                    />
                </div>
                <div className="flex gap-2 pb-1 pt-1">
                    {scrollSnaps.map((_, index) => (
                        <DotButton
                            key={index}
                            onClick={() => onDotButtonClick(index)}
                            className={
                                "h-2.5 w-2.5 rounded-full border transition sm:h-3 sm:w-3 " +
                                (index === selectedIndex
                                    ? "border-[var(--accent)] bg-[var(--accent)]"
                                    : "border-white/35 bg-white/20")
                            }
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmblaCarousel;
