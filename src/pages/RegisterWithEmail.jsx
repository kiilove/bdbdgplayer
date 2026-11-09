import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import dayjs from "dayjs";
import Policy3 from "../components/Policy3";
import { handleToast } from "../components/HandleToast";
import AppDrawer from "../components/common/AppDrawer";
import { UserContext } from "../context/UserContext";
import useFirebaseAuth from "../hooks/useFirebaseAuth";
import {
  checkPlayerEmailInPool,
  createPlayerProfile,
} from "../services/playerService";
import {
  formatPhoneNumber,
  validateEmail,
  validatePhoneNumber,
} from "../utils/formatUtils";

const RegisterWithEmail = () => {
  const navigate = useNavigate();
  const { signUpWithEmail, checkEmailExists } = useFirebaseAuth();
  const { loginSession } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [chkEmail, setChkEmail] = useState(false);
  const [policyDrawerOpen, setPolicyDrawerOpen] = useState(false);

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
        pwd: { code: "short", message: "비밀번호는 6자리 이상 입력해주세요." },
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
      const [existsInAuth, existsInPool] = await Promise.all([
        checkEmailExists(trimmedEmail).catch(() => false),
        checkPlayerEmailInPool(trimmedEmail).catch(() => false),
      ]);
      const exists = existsInAuth || existsInPool;
      if (exists) {
        setChkEmail(false);
        setAlertMessage((prev) => ({
          ...prev,
          email: { code: "exist", message: "이미 사용 중인 이메일입니다." },
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
    } catch {
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
      const { user, error } = await signUpWithEmail(
        form.pEmail.trim(),
        form.password.trim()
      );

      if (error || !user) {
        if (error?.code === "auth/email-already-in-use") {
          setAlertMessage((prev) => ({
            ...prev,
            email: { code: "exist", message: "이미 사용 중인 이메일입니다." },
          }));
        } else {
          handleToast(
            "error",
            error?.message || "회원가입 처리 중 오류가 발생했습니다."
          );
        }
        return;
      }

      const createdProfile = await createPlayerProfile({
        pName: form.pName,
        pEmail: form.pEmail,
        pTel: form.pTel,
        pGender: form.pGender,
        license,
        playerUid: user.uid,
      });

      // 회원가입 직후 Firebase Auth와 UserContext 세션을 즉시 동기화하여 재로그인 불필요
      await loginSession(user, createdProfile);

      navigate("/regsuccess");
    } catch {
      handleToast(
        "error",
        "회원가입 처리 중 오류가 발생했습니다. 다시 시도해 주세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex w-full min-h-screen justify-center items-center bg-[#F6F7F9] text-[#111111] py-12 px-4 font-sans antialiased">
      <AppDrawer
        open={policyDrawerOpen}
        onClose={() => setPolicyDrawerOpen(false)}
        size="md"
      >
        <Policy3 onClose={() => setPolicyDrawerOpen(false)} />
      </AppDrawer>

      <div className="relative z-10 flex flex-col w-full max-w-md items-center">
        <div className="flex w-full justify-center flex-col items-center gap-y-1.5 mb-6 text-center">
          <Link to="/" className="inline-block mb-1">
            <span className="text-2xl font-black text-[#111111] tracking-tighter">
              BDBDG<span className="text-[#FF3B30]">.</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
            선수 회원가입
          </h1>
          <p className="text-sm text-neutral-500 font-medium">
            선수 등록 및 대회 참가를 위한 계정을 생성합니다.
          </p>
        </div>

        <div className="w-full bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col gap-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              NAME · 이름 (실명)
            </label>
            <input
              type="text"
              className="w-full h-12 rounded-xl bg-[#FAFAFA] border border-neutral-200 text-[#111111] placeholder-neutral-400 px-4 text-base focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-black/5 focus:outline-none transition"
              name="pName"
              value={form.pName}
              onChange={handleFieldChange}
              placeholder="실명을 입력해 주세요"
            />
          </div>

          <div className="flex flex-col gap-y-1.5">
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
              EMAIL · 이메일 아이디
            </label>
            <div className="flex w-full gap-x-2">
              <input
                type="email"
                className="w-full h-12 rounded-xl bg-[#FAFAFA] border border-neutral-200 text-[#111111] placeholder-neutral-400 px-4 text-base focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-black/5 focus:outline-none transition"
                name="pEmail"
                value={form.pEmail}
                onChange={handleFieldChange}
                placeholder="name@example.com"
              />
              <button
                type="button"
                className="bg-[#111111] hover:bg-neutral-800 text-white px-4 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition"
                onClick={handleChkEmail}
              >
                중복확인
              </button>
            </div>
            {alertMessage.email.message && (
              <span
                className={`text-xs sm:text-sm font-medium p-2.5 rounded-xl mt-1 border ${
                  alertMessage.email.code === "ok"
                    ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                    : "text-rose-600 bg-rose-50 border-rose-200"
                }`}
              >
                {alertMessage.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              PHONE · 휴대폰 번호
            </label>
            <input
              type="tel"
              inputMode="numeric"
              className="w-full h-12 rounded-xl bg-[#FAFAFA] border border-neutral-200 text-[#111111] placeholder-neutral-400 px-4 text-base focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-black/5 focus:outline-none transition"
              name="pTel"
              value={form.pTel}
              onChange={handleFieldChange}
              placeholder="010-0000-0000"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              PASSWORD · 비밀번호
            </label>
            <input
              type="password"
              className="w-full h-12 rounded-xl bg-[#FAFAFA] border border-neutral-200 text-[#111111] placeholder-neutral-400 px-4 text-base focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-black/5 focus:outline-none transition"
              name="password"
              value={form.password}
              onChange={handlePasswordChange}
              placeholder="6자리 이상 비밀번호"
            />
            {alertMessage.pwd.code === "short" && (
              <span className="text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl mt-1.5 block font-medium">
                {alertMessage.pwd.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              CONFIRM PASSWORD · 비밀번호 확인
            </label>
            <input
              type="password"
              className={`w-full h-12 rounded-xl bg-[#FAFAFA] border px-4 text-base focus:outline-none transition ${
                alertMessage.pwd.code === "wrong"
                  ? "border-rose-500 text-[#111111] bg-rose-50/40"
                  : "border-neutral-200 text-[#111111] placeholder-neutral-400 focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-black/5"
              }`}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="비밀번호 다시 입력"
            />
            {alertMessage.pwd.code === "wrong" && (
              <span className="text-xs sm:text-sm text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl mt-1.5 block font-medium">
                {alertMessage.pwd.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
              GENDER · 성별
            </label>
            <select
              className="w-full h-12 rounded-xl bg-[#FAFAFA] border border-neutral-200 px-4 text-[#111111] text-base focus:bg-white focus:border-[#111111] focus:ring-2 focus:ring-black/5 focus:outline-none cursor-pointer"
              name="pGender"
              value={form.pGender}
              onChange={handleFieldChange}
            >
              <option value="" disabled>
                성별을 선택해 주세요
              </option>
              <option value="m">남자</option>
              <option value="f">여자</option>
            </select>
          </div>

          {/* Terms Section */}
          <div className="bg-[#FAFAFA] border border-neutral-200/80 rounded-xl p-4 flex flex-col gap-y-3 mt-1 text-sm">
            <div className="flex flex-col border-b border-neutral-200 pb-3">
              <label className="flex items-center gap-x-2.5 font-bold text-[#111111] cursor-pointer">
                <input
                  type="checkbox"
                  name="allApply"
                  className="w-4 h-4 accent-[#111111] rounded cursor-pointer"
                  checked={licenseAll}
                  onChange={(e) => handleLicenseAll(e.target.checked)}
                />
                약관 전체 동의
              </label>
              <span className="text-neutral-500 text-xs ml-6 mt-0.5">
                필수 동의 항목 및 대회 안내 수신에 전체 동의합니다.
              </span>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2.5 text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="m1Apply"
                  className="w-4 h-4 accent-[#111111] rounded cursor-pointer"
                  checked={license.m1Apply.value}
                  onChange={(e) =>
                    handleSingleLicense("m1Apply", e.target.checked)
                  }
                />
                <span>
                  <strong className="font-bold text-[#111111]">[필수]</strong>{" "}
                  이용약관 동의
                </span>
              </label>
              <button
                type="button"
                onClick={() => setPolicyDrawerOpen(true)}
                className="text-xs text-neutral-500 hover:text-[#111111] underline font-semibold cursor-pointer p-1"
              >
                보기
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2.5 text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="m2Apply"
                  className="w-4 h-4 accent-[#111111] rounded cursor-pointer"
                  checked={license.m2Apply.value}
                  onChange={(e) =>
                    handleSingleLicense("m2Apply", e.target.checked)
                  }
                />
                <span>
                  <strong className="font-bold text-[#111111]">[필수]</strong>{" "}
                  개인정보 수집 및 이용 동의
                </span>
              </label>
              <button
                type="button"
                onClick={() => setPolicyDrawerOpen(true)}
                className="text-xs text-neutral-500 hover:text-[#111111] underline font-semibold cursor-pointer p-1"
              >
                보기
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-x-2.5 text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  name="s1Apply"
                  className="w-4 h-4 accent-[#111111] rounded cursor-pointer"
                  checked={license.s1Apply.value}
                  onChange={(e) =>
                    handleSingleLicense("s1Apply", e.target.checked)
                  }
                />
                <span>
                  <strong className="font-semibold text-neutral-500">
                    [선택]
                  </strong>{" "}
                  신규 대회 및 공지 알림 받기
                </span>
              </label>
              <button
                type="button"
                onClick={() => setPolicyDrawerOpen(true)}
                className="text-xs text-neutral-500 hover:text-[#111111] underline font-semibold cursor-pointer p-1"
              >
                보기
              </button>
            </div>
          </div>

          {/* Action Button */}
          {isFormValid ? (
            isLoading ? (
              <button
                type="button"
                className="w-full py-4 bg-[#111111] text-white font-bold text-[15px] rounded-xl flex justify-center items-center opacity-90 cursor-not-allowed mt-2"
              >
                <ThreeDots
                  height="20"
                  width="40"
                  radius="9"
                  color="#ffffff"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              </button>
            ) : (
              <button
                type="button"
                className="w-full py-4 bg-[#111111] hover:bg-neutral-800 text-white font-bold text-[15px] rounded-xl transition cursor-pointer text-center mt-2 active:scale-[0.99]"
                onClick={handleRegister}
              >
                회원가입 완료
              </button>
            )
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-4 bg-neutral-100 border border-neutral-200 text-neutral-400 font-semibold text-sm rounded-xl cursor-not-allowed text-center mt-2"
            >
              {chkEmail
                ? "필수 항목을 모두 입력해 주세요"
                : "필수 항목 입력 및 약관 동의가 필요합니다"}
            </button>
          )}
        </div>

        <div className="flex justify-center items-center mt-6 text-center">
          <p className="text-sm text-neutral-500 font-medium">
            이미 계정이 있으신가요?
            <Link to="/login">
              <span className="text-[#111111] font-bold ml-2 underline underline-offset-4">
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
