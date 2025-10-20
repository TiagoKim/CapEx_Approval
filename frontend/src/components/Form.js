import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Save, Send, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

import { apiService } from '../services/apiService';
import InvestmentDetailForm from './InvestmentDetailForm';

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const FormCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const FormHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
`;

const FormTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const FormSubtitle = styled.p`
  opacity: 0.9;
  font-size: 1rem;
`;

const FormBody = styled.div`
  padding: 2rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const Required = styled.span`
  color: #dc3545;
  margin-left: 0.25rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.error {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.error {
    border-color: #dc3545;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.error {
    border-color: #dc3545;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 140px;
  justify-content: center;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SaveButton = styled(Button)`
  background: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

/**
 * Form Component
 * 투자비 승인 요청 작성/수정 폼
 */
function Form({ user }) {
  const { id } = useParams(); // URL에서 투자비 ID 가져오기
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // 수정 모드 여부

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    defaultValues: {
      company: '',
      team: '',
      user: user?.name || '',
      title: '',
      category: '',
      detail: '',
      amount: '',
      month: new Date().toISOString().slice(0, 7), // YYYY-MM 형식
      project: '',
      projectSOP: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [detailItems, setDetailItems] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // 카테고리 옵션
  const categoryOptions = [
    '설비투자',
    'IT인프라',
    '연구개발',
    '마케팅',
    '인사관리',
    '기타'
  ];

  // 법인명 옵션 (실제로는 API에서 가져와야 함)
  const companyOptions = [
    '한국법인',
    '미국법인',
    '유럽법인',
    '중국법인',
    '일본법인'
  ];

  /**
   * 폼 제출 처리
   */
  const onSubmit = async (data) => {
    setLoading(true);
    setSuccess(false);

    try {
      // 금액을 숫자로 변환
      const formData = {
        ...data,
        amount: parseFloat(data.amount) || 0,
        detailItems: detailItems // 투자비 내역 상세 추가
      };

      let response;
      if (isEditMode) {
        // 수정 모드
        response = await apiService.updateInvestment(id, formData);
        if (response.success) {
          setSuccess(true);
          toast.success('투자비 요청이 성공적으로 수정되었습니다.');
          // 수정 완료 후 목록으로 이동
          setTimeout(() => {
            navigate('/list');
          }, 2000);
        }
      } else {
        // 새 작성 모드
        response = await apiService.createInvestment(formData);
        if (response.success) {
          setSuccess(true);
          reset();
          setDetailItems([]); // 투자비 내역 상세 초기화
          localStorage.removeItem('investmentDraft'); // 임시저장 데이터 삭제
          toast.success('투자비 승인 요청이 성공적으로 제출되었습니다.');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(error.message || (isEditMode ? '투자비 요청 수정에 실패했습니다.' : '투자비 요청 제출에 실패했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * 임시 저장 처리
   */
  const handleSaveDraft = async () => {
    try {
      setLoading(true);
      const formData = watch();
      const draftData = {
        ...formData,
        detailItems: detailItems,
        status: 'Draft' // 임시저장 상태로 설정
      };
      
      // API 호출하여 임시저장
      const response = await apiService.createInvestment(draftData);
      if (response.success) {
        localStorage.setItem('investmentDraft', JSON.stringify(draftData));
        toast.info('임시 저장되었습니다.');
      }
    } catch (error) {
      console.error('Draft save error:', error);
      toast.error('임시 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 투자비 데이터 로드
   */
  const loadInvestmentData = useCallback(async (investmentId) => {
    console.log('Loading investment data for ID:', investmentId);
    setLoadingData(true);
    try {
      const response = await apiService.getInvestmentById(investmentId);
      console.log('API response:', response);
      if (response.success && response.data) {
        const investment = response.data;
        const fields = investment.fields || investment;
        
        console.log('Raw investment data:', investment);
        console.log('Fields data:', fields);
        
        // 폼 데이터 설정
        const formData = {
          company: fields.Company || '',
          team: fields.Team || '',
          user: fields.User || '',
          title: fields.Title || '',
          category: fields.Category || '',
          detail: fields.Detail || '',
          amount: fields.Amount || '',
          month: fields.Month || new Date().toISOString().slice(0, 7),
          project: fields.Project || '',
          projectSOP: fields.ProjectSOP || ''
        };
        
        console.log('Form data to be set:', formData);
        reset(formData);
        
        // 폼 데이터가 제대로 설정되었는지 확인
        setTimeout(() => {
          console.log('Form data after reset:', {
            company: formData.company,
            title: formData.title,
            detail: formData.detail,
            amount: formData.amount
          });
        }, 100);
        
        // 투자비 내역 상세 설정
        console.log('DetailItems raw data:', fields.DetailItems);
        if (fields.DetailItems) {
          try {
            const detailItems = JSON.parse(fields.DetailItems);
            console.log('Parsed DetailItems:', detailItems);
            const finalDetailItems = Array.isArray(detailItems) ? detailItems : [];
            setDetailItems(finalDetailItems);
            console.log('DetailItems state set to:', finalDetailItems);
          } catch (error) {
            console.error('Error parsing DetailItems:', error);
            setDetailItems([]);
          }
        } else {
          console.log('No DetailItems found, setting empty array');
          setDetailItems([]);
        }
      }
    } catch (error) {
      console.error('Error loading investment data:', error);
      toast.error('투자비 데이터를 불러오는데 실패했습니다.');
      navigate('/form'); // 에러 시 새 작성 폼으로 이동
    } finally {
      setLoadingData(false);
    }
  }, [reset, navigate]);

  /**
   * 수정 모드일 때 기존 데이터 로드
   */
  useEffect(() => {
    if (isEditMode && id) {
      loadInvestmentData(id);
    }
  }, [isEditMode, id, loadInvestmentData]);

  /**
   * 임시 저장된 데이터 불러오기 (새 작성 모드에서만)
   */
  React.useEffect(() => {
    if (!isEditMode) {
      const savedDraft = localStorage.getItem('investmentDraft');
      if (savedDraft) {
        try {
          const draftData = JSON.parse(savedDraft);
          
          // 폼 데이터 복원
          const formFields = {};
          Object.keys(draftData).forEach(key => {
            if (key !== 'detailItems' && draftData[key] !== undefined) {
              formFields[key] = draftData[key];
            }
          });
          
          if (Object.keys(formFields).length > 0) {
            reset(formFields);
          }
          
          // 투자비 내역 상세 복원
          if (draftData.detailItems && Array.isArray(draftData.detailItems)) {
            setDetailItems(draftData.detailItems);
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [reset, isEditMode]);

  // 뒤로가기 버튼 스타일 추가
  const BackButton = styled.button`
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    padding: 0.5rem;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  `;

  return (
    <FormContainer>
      <FormCard>
        <FormHeader>
          {isEditMode && (
            <BackButton onClick={() => navigate('/list')} title="목록으로 돌아가기">
              <ArrowLeft size={20} />
            </BackButton>
          )}
          <FormTitle>
            {isEditMode ? '투자비 승인 요청 수정' : '투자비 승인 요청'}
          </FormTitle>
          <FormSubtitle>
            {isEditMode ? '투자비 승인 요청서를 수정해주세요' : '투자비 사용을 위한 승인 요청서를 작성해주세요'}
          </FormSubtitle>
        </FormHeader>

        <FormBody>
          {loadingData && (
            <SuccessMessage style={{ background: '#e3f2fd', color: '#1976d2' }}>
              <AlertCircle size={18} />
              투자비 데이터를 불러오는 중...
            </SuccessMessage>
          )}

          {success && (
            <SuccessMessage>
              <CheckCircle size={18} />
              {isEditMode ? '투자비 요청이 성공적으로 수정되었습니다.' : '투자비 승인 요청이 성공적으로 제출되었습니다.'}
            </SuccessMessage>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGrid>
              {/* 법인명 */}
              <FormGroup>
                <Label htmlFor="company">
                  법인명 <Required>*</Required>
                </Label>
                <Select
                  id="company"
                  {...register('company', { required: '법인명을 선택해주세요' })}
                  className={errors.company ? 'error' : ''}
                >
                  <option value="">법인을 선택하세요</option>
                  {companyOptions.map(company => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </Select>
                {errors.company && (
                  <ErrorMessage>
                    <AlertCircle size={14} />
                    {errors.company.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              {/* 담당팀명 */}
              <FormGroup>
                <Label htmlFor="team">
                  담당팀명 <Required>*</Required>
                </Label>
                <Input
                  id="team"
                  type="text"
                  {...register('team', { 
                    required: '담당팀명을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '팀명은 2자 이상 입력해주세요'
                    }
                  })}
                  className={errors.team ? 'error' : ''}
                  placeholder="예: IT팀, 마케팅팀"
                />
                {errors.team && (
                  <ErrorMessage>
                    <AlertCircle size={14} />
                    {errors.team.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              {/* 담당자 */}
              <FormGroup>
                <Label htmlFor="user">
                  담당자 <Required>*</Required>
                </Label>
                <Input
                  id="user"
                  type="text"
                  {...register('user', { 
                    required: '담당자명을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '담당자명은 2자 이상 입력해주세요'
                    }
                  })}
                  className={errors.user ? 'error' : ''}
                  placeholder="담당자 이름"
                />
                {errors.user && (
                  <ErrorMessage>
                    <AlertCircle size={14} />
                    {errors.user.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              {/* 제목 */}
              <FormGroup>
                <Label htmlFor="title">
                  제목 <Required>*</Required>
                </Label>
                <Input
                  id="title"
                  type="text"
                  {...register('title', { 
                    required: '제목을 입력해주세요',
                    minLength: {
                      value: 5,
                      message: '제목은 5자 이상 입력해주세요'
                    }
                  })}
                  className={errors.title ? 'error' : ''}
                  placeholder="투자비 사용 목적을 간단히 설명"
                />
                {errors.title && (
                  <ErrorMessage>
                    <AlertCircle size={14} />
                    {errors.title.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              {/* 사용목적/카테고리 */}
              <FormGroup>
                <Label htmlFor="category">
                  사용목적/카테고리 <Required>*</Required>
                </Label>
                <Select
                  id="category"
                  {...register('category', { required: '카테고리를 선택해주세요' })}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">카테고리를 선택하세요</option>
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Select>
                {errors.category && (
                  <ErrorMessage>
                    <AlertCircle size={14} />
                    {errors.category.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              {/* 사용월 */}
              <FormGroup>
                <Label htmlFor="month">
                  사용월 <Required>*</Required>
                </Label>
                <Input
                  id="month"
                  type="month"
                  {...register('month', { required: '사용월을 선택해주세요' })}
                  className={errors.month ? 'error' : ''}
                />
                {errors.month && (
                  <ErrorMessage>
                    <AlertCircle size={14} />
                    {errors.month.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              {/* 투자비 금액 */}
              <FormGroup>
                <Label htmlFor="amount">
                  투자비 금액 (원) <Required>*</Required>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  {...register('amount', { 
                    required: '투자비 금액을 입력해주세요',
                    min: {
                      value: 1,
                      message: '투자비 금액은 1원 이상이어야 합니다'
                    }
                  })}
                  className={errors.amount ? 'error' : ''}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                {errors.amount && (
                  <ErrorMessage>
                    <AlertCircle size={14} />
                    {errors.amount.message}
                  </ErrorMessage>
                )}
              </FormGroup>


              {/* 관련 프로젝트 */}
              <FormGroup>
                <Label htmlFor="project">
                  관련 프로젝트
                </Label>
                <Input
                  id="project"
                  type="text"
                  {...register('project')}
                  placeholder="프로젝트명을 입력하세요"
                />
              </FormGroup>

              {/* 프로젝트 SOP */}
              <FormGroup>
                <Label htmlFor="projectSOP">
                  프로젝트 SOP
                </Label>
                <Input
                  id="projectSOP"
                  type="text"
                  {...register('projectSOP')}
                  placeholder="SOP 번호 또는 링크"
                />
              </FormGroup>
            </FormGrid>

            {/* 상세 투자비 내역 */}
            <FormGroup>
              <Label htmlFor="detail">
                상세 투자비 내역 <Required>*</Required>
              </Label>
              <TextArea
                id="detail"
                {...register('detail', { 
                  required: '상세 투자비 내역을 입력해주세요',
                  minLength: {
                    value: 10,
                    message: '상세 내역은 10자 이상 입력해주세요'
                  }
                })}
                className={errors.detail ? 'error' : ''}
                placeholder="투자비 사용 목적과 상세 내역을 구체적으로 작성해주세요..."
              />
              {errors.detail && (
                <ErrorMessage>
                  <AlertCircle size={14} />
                  {errors.detail.message}
                </ErrorMessage>
              )}
            </FormGroup>

            {/* 투자비 내역 상세 폼 */}
            <InvestmentDetailForm
              value={detailItems}
              onChange={setDetailItems}
              totalAmount={watch('amount') || 0}
            />

            <ButtonGroup>
              {!isEditMode && (
                <SaveButton
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading}
                >
                  <Save size={18} />
                  임시저장
                </SaveButton>
              )}

              <SubmitButton
                type="submit"
                disabled={loading || loadingData}
              >
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Send size={18} />
                )}
                {loading ? (isEditMode ? '수정 중...' : '제출 중...') : (isEditMode ? '수정 완료' : '승인 요청 제출')}
              </SubmitButton>
            </ButtonGroup>
          </form>
        </FormBody>
      </FormCard>
    </FormContainer>
  );
}

export default Form;
