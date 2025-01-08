///////////////////////////////////////////////////////////////
// 1) 페르소나별 '운동 접근 가이드' 사전
///////////////////////////////////////////////////////////////
const personaExerciseAdvice = {
    "유형 1: 낮은 공포 / 높은 수용":
      "근력·유연성 운동을 적극 적용 가능. 주 3~4회 고강도도 시도해볼 수 있으나, 재발 모니터링 필수!",
    "유형 2: 단순 회피형":
      "활동 회피(FABQ)가 높으므로 안전감 형성 우선. 등척성 운동이나 간단 스트레칭부터 시작해 점진적 확대.",
    "유형 3: 카타스트로피 & 운동공포형":
      "통증 교육(PNE)과 작은 동작부터. 수중 운동, 저항밴드 등 저강도로 천천히 진행해 심리적 부담 완화.",
    "유형 4: 우울/불안 동반형":
      "심리 상담·약물 병행 고려. 저강도 유산소(걷기, 가벼운 자전거) + 이완요법(명상, 호흡)을 함께 진행.",
    "유형 5: 고기능 & 잠재적 재발 위험형":
      "운동 의욕이 높아 과하게 할 수 있음. 점진적 로딩 원칙 엄수, 휴식과 회복을 잘 안내해야 함.",
    "유형 6: 통증 수용 극저하 & 전신 통증형":
      "장기적 접근이 필수. 수중 운동 등 저부하로 시작, 일상 생활기록표를 사용해 아주 작은 활동부터 늘려가기."
  };
  
  // 기본 운동 가이드
  const defaultExerciseAdvice =
    "혼합형: 전문가와 상의 필요. 특정 영역의 추가 평가 권장.";
  
  ///////////////////////////////////////////////////////////////
  // 2) ICPP 설문 로직 (개선 버전)
  ///////////////////////////////////////////////////////////////
  
  /**
   * HTML에서 지정된 name 값을 기반으로 라디오 버튼 점수를 가져옴
   * @param {string} name - 라디오 버튼의 name 속성 값
   * @returns {number} - 선택된 라디오 버튼의 값 또는 0 (기본값)
   */
  function getScore(name) {
    const radios = document.getElementsByName(name);
    if (radios.length === 0) {
      console.warn(`경고: name="${name}" 라디오 버튼이 존재하지 않습니다.`);
      return 0; // 해당 name이 없으면 0 반환
    }
  
    for (let radio of radios) {
      if (radio.checked) {
        return parseInt(radio.value);
      }
    }
  
    console.warn(`경고: name="${name}" 라디오 버튼이 선택되지 않았습니다.`);
    return 0; // 선택되지 않은 경우 0 반환
  }
  
  /**
   * 점수를 기준으로 도메인을 L/M/H로 분류
   * @param {number} score - 도메인의 총 점수
   * @returns {string} - "L", "M", "H"
   */
  function classifyDomain(score) {
    if (score <= 5) return "L";
    else if (score <= 10) return "M";
    else return "H";
  }
  
  /**
   * ICPP 설문 데이터를 계산하고 페르소나를 판별
   * @returns {object} - 설문 결과 객체
   */
  function calculateICPP() {
    // 도메인별 점수 계산
    const C = getScore("C1") + getScore("C2") + getScore("C3");
    const F = getScore("F1") + getScore("F2") + getScore("F3");
    const K = getScore("K1") + getScore("K2") + getScore("K3");
    const A = getScore("A1") + getScore("A2") + getScore("A3");
    const S = getScore("S1") + getScore("S2") + getScore("S3");
    const P = getScore("P1") + getScore("P2") + getScore("P3");
  
    // 도메인별 L/M/H 분류
    const C_level = classifyDomain(C);
    const F_level = classifyDomain(F);
    const K_level = classifyDomain(K);
    const A_level = classifyDomain(A);
    const S_level = classifyDomain(S);
    const P_level = classifyDomain(P);
  
    // 페르소나 판별 로직
    let persona = "혼합형(추가평가 필요)";
    if (C_level === "L" && F_level === "L" && K_level === "L" && A_level === "L" && S_level === "H" && P_level === "H") {
      persona = "유형 1: 낮은 공포 / 높은 수용";
    } else if (F_level === "H" && C_level !== "H" && K_level !== "H" && A_level !== "H") {
      persona = "유형 2: 단순 회피형";
    } else if (C_level === "H" || K_level === "H") {
      persona = "유형 3: 카타스트로피 & 운동공포형";
    } else if (A_level === "H") {
      persona = "유형 4: 우울/불안 동반형";
    } else if (S_level === "H" && C_level !== "H" && F_level === "L" && K_level === "L" && A_level === "L") {
      persona = "유형 5: 고기능 & 잠재적 재발 위험형";
    } else if (S_level === "L" && P_level === "L" && A_level === "H") {
      persona = "유형 6: 통증 수용 극저하 & 전신 통증형";
    }
  
    // 운동 접근 가이드
    const exerciseAdvice = personaExerciseAdvice[persona] || defaultExerciseAdvice;
  
    // 결과 반환
    return {
      C, F, K, A, S, P, // 점수
      persona,
      exerciseAdvice
    };
  }
  
  // 외부에서 사용할 수 있도록 export
  window.calculateICPP = calculateICPP;
  