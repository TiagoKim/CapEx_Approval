import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { 
  X, CheckCircle, XCircle, Clock, MessageSquare, 
  Users, DollarSign, FileText,
  Edit, Trash2
} from 'lucide-react';

import { apiService } from '../services/apiService';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
`;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: #333;
  font-weight: 600;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &.pending {
    background: #fff3cd;
    color: #856404;
  }

  &.approved {
    background: #d4edda;
    color: #155724;
  }

  &.rejected {
    background: #f8d7da;
    color: #721c24;
  }
`;

const DetailSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailText = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const AdminComment = styled.div`
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #dee2e6;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ApproveButton = styled(ActionButton)`
  background: #28a745;
  color: white;

  &:hover:not(:disabled) {
    background: #218838;
    transform: translateY(-2px);
  }
`;

const RejectButton = styled(ActionButton)`
  background: #dc3545;
  color: white;

  &:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-2px);
  }
`;

const PendingButton = styled(ActionButton)`
  background: #ffc107;
  color: #212529;

  &:hover:not(:disabled) {
    background: #e0a800;
    transform: translateY(-2px);
  }
`;

const EditButton = styled(ActionButton)`
  background: #17a2b8;
  color: white;

  &:hover:not(:disabled) {
    background: #138496;
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(ActionButton)`
  background: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6268;
    transform: translateY(-2px);
  }
`;

const CommentModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
`;

const CommentModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const CommentTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
`;

const CommentTextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const CommentActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f8f9fa;
  }
`;

const ConfirmButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  background: #667eea;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #5a6fd8;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/**
 * InvestmentDetail Component
 * 투자비 요청 상세보기 팝업
 */
function InvestmentDetail({ investment, user, onClose, onStatusChange, onEdit, onDelete }) {
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!investment) return null;

  const fields = investment.fields || {};

  /**
   * 상태 변경 처리
   */
  const handleStatusChange = async (status) => {
    setSelectedAction(status);
    setAdminComment('');
    setShowCommentModal(true);
  };

  /**
   * 상태 변경 확인
   */
  const handleStatusConfirm = async () => {
    if (!selectedAction) return;

    setLoading(true);
    try {
      await apiService.updateInvestmentStatus(
        investment.id,
        selectedAction,
        adminComment
      );

      const statusText = {
        'Approved': '승인',
        'Rejected': '거절',
        'Pending': '보류'
      }[selectedAction];

      toast.success(`투자비 요청이 ${statusText}되었습니다.`);
      
      setShowCommentModal(false);
      if (onStatusChange) {
        onStatusChange(investment.id, selectedAction, adminComment);
      }
      onClose();
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error.message || '상태 변경에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 상태 배지 렌더링
   */
  const renderStatusBadge = (status) => {
    const statusMap = {
      'Pending': { text: '대기', class: 'pending' },
      'Approved': { text: '승인', class: 'approved' },
      'Rejected': { text: '거절', class: 'rejected' }
    };

    const statusInfo = statusMap[status] || { text: status, class: 'pending' };
    
    return (
      <StatusBadge className={statusInfo.class}>
        {statusInfo.text}
      </StatusBadge>
    );
  };

  /**
   * 액션 버튼 렌더링
   */
  const renderActionButtons = () => {
    const isOwner = fields.RequestedBy === user?.email;
    const isAdmin = user?.isAdmin;

    return (
      <ActionButtons>
        {(isOwner || isAdmin) && (
          <EditButton onClick={() => onEdit && onEdit(investment)}>
            <Edit size={18} />
            수정
          </EditButton>
        )}

        {(isOwner || isAdmin) && (
          <DeleteButton onClick={() => onDelete && onDelete(investment.id)}>
            <Trash2 size={18} />
            삭제
          </DeleteButton>
        )}

        {isAdmin && (
          <>
            <ApproveButton onClick={() => handleStatusChange('Approved')}>
              <CheckCircle size={18} />
              승인
            </ApproveButton>

            <RejectButton onClick={() => handleStatusChange('Rejected')}>
              <XCircle size={18} />
              거절
            </RejectButton>

            <PendingButton onClick={() => handleStatusChange('Pending')}>
              <Clock size={18} />
              보류
            </PendingButton>
          </>
        )}
      </ActionButtons>
    );
  };

  return (
    <>
      <ModalOverlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{fields.Title || '투자비 요청 상세'}</ModalTitle>
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          </ModalHeader>

          <ModalBody>
            <InfoGrid>
              <InfoCard>
                <InfoLabel>법인명</InfoLabel>
                <InfoValue>{fields.Company || '-'}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>담당팀</InfoLabel>
                <InfoValue>{fields.Team || '-'}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>담당자</InfoLabel>
                <InfoValue>{fields.User || '-'}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>카테고리</InfoLabel>
                <InfoValue>{fields.Category || '-'}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>투자비 금액</InfoLabel>
                <InfoValue>
                  {fields.Amount ? `${parseInt(fields.Amount).toLocaleString()}원` : '-'}
                </InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>상태</InfoLabel>
                <InfoValue>{renderStatusBadge(fields.Status)}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>사용월</InfoLabel>
                <InfoValue>{fields.Month || '-'}</InfoValue>
              </InfoCard>

              <InfoCard>
                <InfoLabel>요청일</InfoLabel>
                <InfoValue>
                  {fields.RequestedDate ? 
                    new Date(fields.RequestedDate).toLocaleDateString('ko-KR') : 
                    '-'
                  }
                </InfoValue>
              </InfoCard>

              {fields.Project && (
                <InfoCard>
                  <InfoLabel>관련 프로젝트</InfoLabel>
                  <InfoValue>{fields.Project}</InfoValue>
                </InfoCard>
              )}

              {fields.ProjectSOP && (
                <InfoCard>
                  <InfoLabel>프로젝트 SOP</InfoLabel>
                  <InfoValue>{fields.ProjectSOP}</InfoValue>
                </InfoCard>
              )}
            </InfoGrid>

            <DetailSection>
              <SectionTitle>
                <FileText size={18} />
                상세 투자비 내역
              </SectionTitle>
              <DetailText>{fields.Detail || '상세 내역이 없습니다.'}</DetailText>
            </DetailSection>

            {fields.DetailItems && (
              <DetailSection>
                <SectionTitle>
                  <DollarSign size={18} />
                  투자비 내역 상세
                </SectionTitle>
                {(() => {
                  try {
                    const detailItems = JSON.parse(fields.DetailItems);
                    const totalDetailAmount = detailItems.reduce((sum, item) => sum + (item.amount || 0), 0);
                    const difference = (fields.Amount || 0) - totalDetailAmount;
                    
                    return (
                      <div>
                        {detailItems.map((item, index) => (
                          <InfoCard key={index} style={{ marginBottom: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <InfoLabel>내역</InfoLabel>
                                <InfoValue>{item.description}</InfoValue>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <InfoLabel>금액</InfoLabel>
                                <InfoValue>{parseInt(item.amount || 0).toLocaleString()}원</InfoValue>
                              </div>
                            </div>
                          </InfoCard>
                        ))}
                        
                        <InfoCard style={{ background: '#e3f2fd', borderLeftColor: '#2196f3' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <InfoLabel>상세 내역 합계</InfoLabel>
                              <InfoValue>{parseInt(totalDetailAmount).toLocaleString()}원</InfoValue>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <InfoLabel>차액</InfoLabel>
                              <InfoValue style={{ 
                                color: difference === 0 ? '#28a745' : difference > 0 ? '#dc3545' : '#ffc107' 
                              }}>
                                {difference === 0 ? '0원 (일치)' : 
                                 difference > 0 ? `+${parseInt(difference).toLocaleString()}원 (부족)` : 
                                 `${parseInt(difference).toLocaleString()}원 (초과)`}
                              </InfoValue>
                            </div>
                          </div>
                        </InfoCard>
                      </div>
                    );
                  } catch (error) {
                    return <DetailText>투자비 내역 상세를 불러올 수 없습니다.</DetailText>;
                  }
                })()}
              </DetailSection>
            )}

            {fields.AdminComment && (
              <DetailSection>
                <SectionTitle>
                  <MessageSquare size={18} />
                  관리자 의견
                </SectionTitle>
                <AdminComment>{fields.AdminComment}</AdminComment>
              </DetailSection>
            )}

            {fields.ProcessedBy && (
              <DetailSection>
                <SectionTitle>
                  <Users size={18} />
                  처리 정보
                </SectionTitle>
                <InfoGrid>
                  <InfoCard>
                    <InfoLabel>처리자</InfoLabel>
                    <InfoValue>{fields.ProcessedBy}</InfoValue>
                  </InfoCard>
                  <InfoCard>
                    <InfoLabel>처리일</InfoLabel>
                    <InfoValue>
                      {fields.ProcessedDate ? 
                        new Date(fields.ProcessedDate).toLocaleDateString('ko-KR') : 
                        '-'
                      }
                    </InfoValue>
                  </InfoCard>
                </InfoGrid>
              </DetailSection>
            )}

            {renderActionButtons()}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>

      {/* 상태 변경 의견 입력 모달 */}
      {showCommentModal && (
        <CommentModal onClick={() => setShowCommentModal(false)}>
          <CommentModalContent onClick={(e) => e.stopPropagation()}>
            <CommentTitle>
              {selectedAction === 'Approved' ? '승인' : 
               selectedAction === 'Rejected' ? '거절' : '보류'} 의견
            </CommentTitle>
            
            <CommentTextArea
              value={adminComment}
              onChange={(e) => setAdminComment(e.target.value)}
              placeholder={`${selectedAction === 'Approved' ? '승인' : 
                          selectedAction === 'Rejected' ? '거절' : '보류'} 사유를 입력하세요...`}
            />

            <CommentActions>
              <CancelButton onClick={() => setShowCommentModal(false)}>
                취소
              </CancelButton>
              <ConfirmButton 
                onClick={handleStatusConfirm}
                disabled={loading}
              >
                {loading ? '처리 중...' : 
                 selectedAction === 'Approved' ? '승인' : 
                 selectedAction === 'Rejected' ? '거절' : '보류'}
              </ConfirmButton>
            </CommentActions>
          </CommentModalContent>
        </CommentModal>
      )}
    </>
  );
}

export default InvestmentDetail;
