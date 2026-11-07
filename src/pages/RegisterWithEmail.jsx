import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  getAuth,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ThreeDots } from "react-loader-spinner";
import dayjs from "dayjs";
import { db } from "../firebase";
import {
  formatPhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "../utils/formatUtils";

const RegisterWithEmail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [chkEmail, setChkEmail] = useState(false);

  const [form, setForm] = useState({
    pName: "",
    pEmail: "",
    pTel: "",
    password: "",
    confirmPassword: "",
    pGender: "",
  });

  const [license, setLicense] = useState({
    m1Apply: { value: false, at: "" },
    m2Apply: { value: false, at: "" },
    s1Apply: { value: false, at: "" },
  });

  const [alertMessage, setAlertMessage] = useState({
    email: { code: "", message: "" },
    pwd: { code: "", message: "" },
  });

  const licenseAll =
    license.m1Apply.value && license.m2Apply.value && license.s1Apply.value;

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === "pTel") {
      setForm((prev) => ({ ...prev, pTel: formatPhoneNumber(value) }));
      return;
    }
    if (name === "pEmail") {
      setChkEmail(false);
      setAlertMessage((prev) => ({ ...prev, email: { code: "", message: "" } }));
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    const nextForm = { ...form, [name]: value };
    setForm(nextForm);

    if (nextForm.password.length > 0 && nextForm.password.length < 6) {
      setAlertMessage((prev) => ({
        ...prev,
        pwd: { code: "short", message: "6자리 이상 입력해주세요." },
      }));
    } else if (
      nextForm.confirmPassword.length > 0 &&
      nextForm.password !== nextForm.confirmPassword
    ) {
      setAlertMessage((prev) => ({
        ...prev,
        pwd: { code: "wrong", message: "비밀번호가 일치하지 않습니다." },
      }));
    } else {
      setAlertMessage((prev) => ({
        ...prev,
        pwd: { code: "", message: "" },
      }));
    }
  };

  const handleLicenseAll = (checked) => {
    const nowStr = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    setLicense({
      m1Apply: { value: checked, at: nowStr },
      m2Apply: { value: checked, at: nowStr },
      s1Apply: { value: checked, at: nowStr },
    });
  };

  const handleSingleLicense = (key, checked) => {
    const nowStr = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    setLicense((prev) => ({
      ...prev,
      [key]: { value: checked, at: nowStr },
    }));
  };

  const handleChkEmail = async () => {
    const trimmedEmail = form.pEmail.trim();
    if (!validateEmail(trimmedEmail)) {
      setAlertMessage((prev) => ({
        ...prev,
        email: {
          code: "invalid",
          message: "올바른 이메일 형식을 입력해주세요.",
        },
      }));
      return;
    }

    try {
      const auth = getAuth();
      const signInMethods = await fetchSignInMethodsForEmail(
        auth,
        trimmedEmail
      );
      if (signInMethods.length > 0) {
        setChkEmail(false);
        setAlertMessage((prev) => ({
          ...prev,
          email: { code: "exist", message: "이미 사용중인 이메일입니다." },
        }));
      } else {
        setChkEmail(true);
        setAlertMessage((prev) => ({
          ...prev,
          email: {
            code: "ok",
            message: "사용 가능한 이메일입니다.",
          },
        }));
      }
    } catch (error) {
      setAlertMessage((prev) => ({
        ...prev,
        email: {
          code: "error",
          message: "이메일 확인 중 오류가 발생했습니다.",
        },
      }));
    }
  };

  const isPasswordValid =
    form.password.length >= 6 && form.password === form.confirmPassword;
  const isInputsValid =
    form.pName.trim().length > 0 &&
    validateEmail(form.pEmail.trim()) &&
    validatePhoneNumber(form.pTel);
  const isGenderValid = form.pGender === "m" || form.pGender === "f";
  const isTermsValid = license.m1Apply.value && license.m2Apply.value;
  const isFormValid =
    isInputsValid && isPasswordValid && isGenderValid && isTermsValid;

  const handleRegister = async () => {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.pEmail.trim(),
        form.password.trim()
      );
      const uid = userCred.user.uid;

      await addDoc(collection(db, "players_pool"), {
        pName: form.pName.trim(),
        pEmail: form.pEmail.trim(),
        pTel: form.pTel,
        pGender: form.pGender,
        gender: form.pGender,
        license,
        playerUid: uid,
      });

      navigate("/regsuccess");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setAlertMessage((prev) => ({
          ...prev,
          email: { code: "exist", message: "이미 사용중인 이메일입니다." },
        }));
      } else {
        alert("회원가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen justify-center items-center bg-[#0B0B0B] text-white py-12 px-4 font-sans antialiased">
      <div className="flex flex-col w-full max-w-md items-center">
        <div className="flex w-full justify-center flex-col items-center gap-y-2 mb-8 text-center">
          <Link to="/" className="inline-block mb-3">
            <span className="text-3xl font-black text-white tracking-tighter uppercase">
              BDBDG
            </span>
          </Link>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-neutral-800 text-neutral-300 border border-neutral-700 tracking-wider uppercase">
            Create Account
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-2">
            회원가입
          </h1>
          <p className="text-xs text-neutral-400 font-medium">
            선수 등록 및 대회 참가를 위한 계정을 생성합니다.
          </p>
        </div>

        <div className="w-full bg-[#141414] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              이름
            </label>
            <input
              type="text"
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
              name="pName"
              value={form.pName}
              onChange={handleFieldChange}
              placeholder="실명 입력"
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="block text-xs font-bold text-neutral-400">
              이메일
            </label>
            <div className="flex w-full gap-x-2">
              <input
                type="email"
                className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
                name="pEmail"
                value={form.pEmail}
                onChange={handleFieldChange}
                placeholder="name@example.com"
              />
              <button
                type="button"
                className="bg-white hover:bg-neutral-200 text-black px-4 rounded-2xl text-xs font-black whitespace-nowrap cursor-pointer transition"
                onClick={handleChkEmail}
              >
                중복확인
              </button>
            </div>
            {alertMessage.email.message && (
              <span
                className={`text-xs p-2 rounded-xl mt-1 border ${
                  alertMessage.email.code === "ok"
                    ? "text-emerald-400 bg-emerald-950/40 border-emerald-800/60"
                    : "text-rose-400 bg-rose-950/40 border-rose-800/60"
                }`}
              >
                {alertMessage.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              연락처
            </label>
            <input
              type="text"
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
              name="pTel"
              value={form.pTel}
              onChange={handleFieldChange}
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              비밀번호
            </label>
            <input
              type="password"
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 text-white placeholder-neutral-600 px-4 text-sm focus:border-white focus:outline-none transition"
              name="password"
              value={form.password}
              onChange={handlePasswordChange}
              placeholder="6자리 이상 비밀번호"
            />
            {alertMessage.pwd.code === "short" && (
              <span className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl mt-1 block">
                {alertMessage.pwd.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              비밀번호 확인
            </label>
            <input
              type="password"
              className={`w-full h-12 rounded-2xl bg-[#1A1A1A] border px-4 text-sm focus:outline-none transition ${
                alertMessage.pwd.code === "wrong"
                  ? "border-rose-500 text-white"
                  : "border-neutral-800 text-white placeholder-neutral-600 focus:border-white"
              }`}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="비밀번호 다시 입력"
            />
            {alertMessage.pwd.code === "wrong" && (
              <span className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 p-2 rounded-xl mt-1 block">
                {alertMessage.pwd.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 mb-1.5">
              성별
            </label>
            <select
              className="w-full h-12 rounded-2xl bg-[#1A1A1A] border border-neutral-800 px-4 text-white text-sm focus:border-white focus:outline-none cursor-pointer"
              name="pGender"
              value={form.pGender}
              onChange={handleFieldChange}
            >
              <option value="" disabled>
                성별 선택
              </option>
              <option value="m">남자</option>
              <option value="f">여자</option>
            </select>
          </div>

          {/* Terms Section */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex flex-col gap-y-3 mt-2 text-xs">
            <div className="flex flex-col border-b border-neutral-800 pb-3">
              <label className="flex items-center gap-x-2 font-black text-white cursor-pointer">
                <input
                  type="checkbox"
                  name="allApply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                  checked={licenseAll}
                  onChange={(e) => handleLicenseAll(e.target.checked)}
                />
                전체 동의
              </label>
              <span className="text-neutral-500 text-[11px] ml-6 mt-0.5">
                필수동의 항목 및 이벤트 정보 수신에 전체 동의합니다.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="m1Apply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                  checked={license.m1Apply.value}
                  onChange={(e) =>
                    handleSingleLicense("m1Apply", e.target.checked)
                  }
                />
                <span className="font-bold text-white">[필수]</span> 이용약관 동의
              </label>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-neutral-600 text-xs"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="m2Apply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                  checked={license.m2Apply.value}
                  onChange={(e) =>
                    handleSingleLicense("m2Apply", e.target.checked)
                  }
                />
                <span className="font-bold text-white">[필수]</span> 개인정보 수집 및 이용 동의
              </label>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-neutral-600 text-xs"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="s1Apply"
                  className="w-4 h-4 accent-white rounded cursor-pointer"
                  checked={license.s1Apply.value}
                  onChange={(e) =>
                    handleSingleLicense("s1Apply", e.target.checked)
                  }
                />
                <span className="font-bold text-neutral-400">[선택]</span> 신규 콘텐츠/이벤트 알림받기
              </label>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="text-neutral-600 text-xs"
              />
            </div>
          </div>

          {/* Action Button */}
          {isFormValid ? (
            isLoading ? (
              <button className="w-full py-4 bg-white text-black font-black text-sm rounded-full flex justify-center items-center opacity-90 cursor-not-allowed mt-2">
                <ThreeDots
                  height="20"
                  width="40"
                  radius="9"
                  color="#000"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              </button>
            ) : (
              <button
                className="w-full py-4 bg-white hover:bg-neutral-200 text-black font-black text-sm rounded-full shadow-xl transition cursor-pointer text-center tracking-tight mt-2"
                onClick={handleRegister}
              >
                회원가입 완료
              </button>
            )
          ) : (
            <button
              disabled
              className="w-full py-4 bg-neutral-900 border border-neutral-800 text-neutral-600 font-bold text-xs rounded-full cursor-not-allowed text-center mt-2"
            >
              {chkEmail
                ? "필수 항목을 모두 입력해 주세요"
                : "필수 항목 입력 및 약관 동의가 필요합니다"}
            </button>
          )}
        </div>

        <div className="flex justify-center items-center mt-8 text-center">
          <p className="text-xs text-neutral-400 font-medium">
            이미 계정이 있으신가요?
            <Link to="/login">
              <span className="text-white font-bold ml-2 underline underline-offset-4 hover:text-neutral-300">
                로그인하기
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterWithEmail;
