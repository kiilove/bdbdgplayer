import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Banner2 } from "../components/Banners";
import BottomMenu from "../components/BottomMenu";
import Header from "../components/Header";
const dummyData = [
  {
    id: 1,
    title: "경기용인시보디빌딩 6회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 187,
    game: "180cm이하 클래식",
    grade: 1,
    date: "12-01",
    year: 2022,
  },
  {
    id: 2,
    title: "경기용인시보디빌딩 5회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 381,
    game: "170cm이하 클래식",
    grade: 3,
    date: "11-23",
    year: 2022,
  },
  {
    id: 3,
    title: "경기용인시보디빌딩 4회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 231,
    game: "180cm이하 클래식",
    grade: 6,
    date: "09-03",
    year: 2022,
  },
  {
    id: 4,
    title: "경기용인시보디빌딩 3회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 187,
    game: "180cm이하 클래식",
    grade: 4,
    date: "03-05",
    year: 2021,
  },
  {
    id: 5,
    title: "경기용인시보디빌딩 2회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 381,
    game: "170cm이하 클래식",
    grade: 5,
    date: "02-23",
    year: 2021,
  },
  {
    id: 6,
    title: "경기용인시보디빌딩 1회",
    location: "경기도용인시립체육관 1층 대광장",
    count: 131,
    game: "180cm이하 클래식",
    grade: 8,
    date: "01-15",
    year: 2021,
  },
];

const Career = () => {
  const [careerYear, setCareerYear] = useState(2023);
  return (
    <div className="flex w-full justify-center">
      <BottomMenu />
      <div
        className="flex w-full h-full justify-center items-start align-top bg-slate-100 flex-col"
        style={{ maxWidth: "420px" }}
      >
        <Header title="나의 커리어" banner={<Banner2 />} />
        <div className="flex w-full h-full justify-center items-start align-top flex-col gap-y-3">
          <div className="flex w-full justify-between mb-20">
            <div className="flex w-full h-full justify-start flex-col gap-y-3 mt-6 px-2">
              <div className="flex flex-col w-full gap-y-3">
                {dummyData.map((item, idx) => {
                  return (
                    <>
                      {item.year !== careerYear && (
                        <p className="text-lg font-light px-2">{item.year}</p>
                      )}
                      <Link to="/careerview">
                        <div className="flex bg-white rounded-lg p-4 shadow-sm">
                          <div className="flex w-2/3 justify-center items-start flex-col ">
                            <span className="text-sm font-light">
                              {item.date}
                            </span>
                            <span className="text-base mt-2 mb-2 xs:text-xl">
                              {item.title}
                            </span>
                            <span className="text-xs font-light">
                              {item.location}
                            </span>
                            <span className="text-xs font-light">
                              {item.count}명 출전
                            </span>
                          </div>
                          <div className="flex w-1/3 justify-end items-center flex-col">
                            <span className="text-xs font-light">
                              {item.game}
                            </span>
                            <span className="text-5xl font-bold">
                              {item.grade}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
