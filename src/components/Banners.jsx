export const Banner1 = () => (
  <div className="flex w-full h-24 bg-gray-300 flex-col justify-center items-center">
    <div className="flex w-full justify-center">
      <span className="text-lg font-semibold text-gray-700">
        경기용인시보디빌딩 13회 참가 선수 모집중
      </span>
    </div>
    <div className="flex w-full justify-between px-5 mt-5">
      <span className="text-sm font-light text-gray-600">
        대회일자 : 2023-03-01
      </span>
      <span className="text-sm font-bold text-gray-800">등록하기</span>
    </div>
  </div>
);

export const Banner2 = () => (
  <div className="flex w-full bg-gray-300 flex-col justify-center items-center">
    <img
      src="https://firebasestorage.googleapis.com/v0/b/body-36982.appspot.com/o/images%2Fbanner%2Fmaxresdefault.jpg?alt=media&token=a91c2cc7-0733-4445-8c3f-5b4edf125d77"
      className="object-cover h-32 w-full"
    />
    <span
      className="fixed left-1/2 text-white text-2xl font-bold drop-shadow-xl shadow-black"
      style={{ transform: "translate(-50%,0)" }}
    >
      용인대회 출전신청
    </span>
  </div>
);
