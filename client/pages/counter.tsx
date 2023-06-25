import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/Counter.module.scss";
// @ts-ignore
import numberFormatter from "number-formatter";
import clsx from "clsx";
// @ts-ignore
// import { AnimatedCounter } from "react-animated-counter";

interface Props {}

const counter: React.FC<Props> = (props: Props) => {
  const [defaultNumber, setDefaultNumber] = useState<number>(0);
  const [init, setInit] = useState<number>(0);
  const [number, setNumber] = useState<number>(0);
  const [noValues, setNoValues] = useState<boolean>(false);
  const [counterStopped, setCounterStopped] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [roll, setRoll] = useState<boolean>(false);
  const [slide, setSlide] = useState<boolean>(false);
  let dividedNumber = number / 100;
  let formatedNumber = numberFormatter("# ##0.#0", dividedNumber.toFixed(2));
  let array = formatedNumber.split("");

  const counter: any = useRef();

  useEffect(() => {
    setDefaultNumber(111111);
  }, []);

  // SET VALUES  SET VALUES  SET VALUES  SET VALUES
  useEffect(() => {
    let offset: number = 0;

    if (defaultNumber <= 100) {
      offset = 50;
    }

    if (defaultNumber > 100) {
      offset = 100;
    }

    if (defaultNumber > 200) {
      offset = 200;
    }

    if (defaultNumber <= 50) {
      offset = 10;
    }

    if (defaultNumber <= 10) {
      setInit(0);
      setNumber(0);
    } else {
      setInit(defaultNumber);
      setNumber(defaultNumber - offset);
    }

    return () => {
      clearInterval(counter.current);
    };
  }, [defaultNumber]);
  // SET VALUES  SET VALUES  SET VALUES  SET VALUES

  // START COUNTER  START COUNTER  START COUNTER
  useEffect(() => {
    if (!noValues) {
      if (loaded) {
        counter.current = setInterval(() => {
          setRoll(false);
          setSlide(true);
          setTimeout(() => {
            setSlide(false);
            setNumber((number) => number + 10);
          }, 470);
          setTimeout(() => {
            setRoll(true);
          }, 30);
        }, 500);
      }
    }
  }, [loaded]);
  // START COUNTER  START COUNTER  START COUNTER

  // END COUNTER  END COUNTER  END COUNTER
  useEffect(() => {
    let initFixed: number = Number((init / 10).toFixed());
    let numberFixed: number = Number((number / 10).toFixed());

    if (initFixed === numberFixed) {
      clearInterval(counter.current);
      setRoll(false);
      setSlide(false);
      setCounterStopped(true);
    }

    if (init && number && !loaded) {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    }
  }, [init, number]);
  // END COUNTER  END COUNTER  END COUNTER

  return (
    <div className={styles.main}>
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
              console.log(last_first);

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
                      last_first && styles.rolling,
                      last_first && roll && styles.rolling,

                      last_second && slide && styles.sliding,

                      array[array.length - 2] === "9" &&
                        last_third &&
                        slide &&
                        styles.sliding,

                      array[array.length - 2] === "9" &&
                        array[array.length - 4] === "9" &&
                        last_fourth &&
                        slide &&
                        styles.sliding,

                      array[array.length - 2] === "9" &&
                        array[array.length - 4] === "9" &&
                        array[array.length - 5] === "9" &&
                        last_fifth &&
                        slide &&
                        styles.sliding,

                      array[array.length - 2] === "9" &&
                        array[array.length - 4] === "9" &&
                        array[array.length - 5] === "9" &&
                        array[array.length - 6] === "9" &&
                        last_sixth &&
                        slide &&
                        styles.sliding,

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
                    {last_first ? (
                      !counterStopped ? (
                        <span>{x}</span>
                      ) : (
                        <>
                          <span>0</span>
                          <span>1</span>
                          <span>2</span>
                          <span>3</span>
                          <span>4</span>
                          <span>5</span>
                          <span>6</span>
                          <span>7</span>
                          <span>8</span>
                          <span>9</span>
                          <span>0</span>
                        </>
                      )
                    ) : (
                      <>
                        <span>{x}</span>
                        {y !== "" && <span>{y}</span>}
                      </>
                    )}
                    <span>{x}</span>
                    {y !== "" && <span>{y}</span>}
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
