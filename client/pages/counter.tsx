import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/Counter.module.scss";
// @ts-ignore
import numberFormatter from "number-formatter";
import clsx from "clsx";
// @ts-ignore
// import { AnimatedCounter } from "react-animated-counter";

interface Props {}

const counter: React.FC<Props> = (props: Props) => {
  const [defaultNumber, setDefaultNumber] = useState<number>(10000);
  const [number, setNumber] = useState<number>(0);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [slide, setSlide] = useState<boolean>(false);
  const [isCounting, setIsCounting] = useState<boolean>(false);
  const [prevValue, setPrevValue] = useState<number>(0);
  let dividedNumber = number / 100;
  let formatedNumber = numberFormatter("# ##0.#0", dividedNumber.toFixed(2));
  let array = formatedNumber.split("");

  const counter: any = useRef();
  const originalValueInterval: any = useRef(null);

  useEffect(() => {
    originalValueInterval.current = setInterval(() => {
      let decidingRandom = Number(Math.random().toFixed(2));

      setDefaultNumber((x) => (decidingRandom > 0.5 ? x + 5 : x));
      console.log(decidingRandom);
    }, Math.floor(Math.random() * 2000) + 5000);
  }, []);

  // SET VALUES  SET VALUES  SET VALUES  SET VALUES

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (defaultNumber > 0) {
        setIsCounting(true);
        setLoaded(true);
        clearInterval(myInterval);

        let offset: number = 5;

        setNumber(defaultNumber - offset);
      }
    }, 20);
  }, []);

  // SET VALUES  SET VALUES  SET VALUES  SET VALUES

  // START COUNTER  START COUNTER  START COUNTER

  useEffect(() => {
    if (isCounting) {
      counter.current = setInterval(() => {
        setSlide(true);
        setTimeout(() => {
          setSlide(false);
          setNumber((number) => number + 1);
        }, 950);
      }, 1000);
    }
  }, [isCounting]);

  // START COUNTER  START COUNTER  START COUNTER

  // CLEAR INTERVAL START CLEAR INTERVAL START CLEAR INTERVAL START
  useEffect(() => {
    if (number >= defaultNumber - 2) {
      setIsCounting(false);
      clearInterval(counter.current);
      console.log("stopped, I think");
      setPrevValue(defaultNumber);
    }
  }, [number]);

  useEffect(() => {
    console.log(defaultNumber);
    if (prevValue > 0) {
      setIsCounting(true);
      setPrevValue(0);
    }
  }, [defaultNumber]);
  // CLEAR INTERVAL END CLEAR INTERVAL END CLEAR INTERVAL END

  return (
    <div className={styles.main}>
      <h3>{defaultNumber}</h3>
      <div className={styles.counter}>
        <div className={styles.counter__inside}>
          <div
            style={{ marginRight: "30px" }}
            className={clsx(styles.counter__divider, styles.left)}
          ></div>

          {loaded ? (
            array.map((x: string, i: number) => {
              let y: string = "";
              let last_first: boolean = i === array.length - 1;
              let last_second: boolean = i === array.length - 2;
              let last_third: boolean = i === array.length - 4;
              let last_fourth: boolean = i === array.length - 5;
              let last_fifth: boolean = i === array.length - 6;
              let last_sixth: boolean = i === array.length - 8;
              let last_seventh: boolean = i === array.length - 9;

              for (let i = 0; i <= 9; i++) {
                if (x === i.toString() && i !== 9) {
                  let number: string = (i + 1).toString();
                  y = number;
                }

                if (x === i.toString() && i === 9) {
                  y = "0";
                }
              }

              return (
                <div key={i} className={styles.counter__number}>
                  <div
                    className={clsx(
                      styles.counter__number_slide,

                      last_first && slide && styles.sliding,

                      array[array.length - 1] === "9" &&
                        last_second &&
                        slide &&
                        styles.sliding,

                      array[array.length - 1] === "9" &&
                        array[array.length - 2] === "9" &&
                        last_third &&
                        slide &&
                        styles.sliding,

                      array[array.length - 1] === "9" &&
                        array[array.length - 2] === "9" &&
                        array[array.length - 4] === "9" &&
                        last_fourth &&
                        slide &&
                        styles.sliding,

                      array[array.length - 1] === "9" &&
                        array[array.length - 2] === "9" &&
                        array[array.length - 4] === "9" &&
                        array[array.length - 5] === "9" &&
                        last_fifth &&
                        slide &&
                        styles.sliding,

                      array[array.length - 1] === "9" &&
                        array[array.length - 2] === "9" &&
                        array[array.length - 4] === "9" &&
                        array[array.length - 5] === "9" &&
                        array[array.length - 6] === "9" &&
                        last_sixth &&
                        slide &&
                        styles.sliding,

                      array[array.length - 1] === "9" &&
                        array[array.length - 2] === "9" &&
                        array[array.length - 4] === "9" &&
                        array[array.length - 5] === "9" &&
                        array[array.length - 6] === "9" &&
                        array[array.length - 8] === "9" &&
                        last_seventh &&
                        slide &&
                        styles.sliding
                    )}
                  >
                    <>
                      <span>{x}</span>
                      {y !== "" && <span>{y}</span>}
                    </>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              <h1 style={{ fontSize: "250px", width: "870px", color: "#fff" }}>
                Hello...
              </h1>
            </>
          )}

          {/* <AnimatedCounter
            value={Number(formatedNumber)}
            color="white"
            fontSize="40px"
          /> */}
          <div
            style={{ marginLeft: "35px" }}
            className={clsx(styles.counter__divider, styles.left)}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default counter;
