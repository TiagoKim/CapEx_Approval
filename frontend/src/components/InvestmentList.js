import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { 
  Eye, Edit, Trash2, CheckCircle, XCircle, Clock, 
  Search, RefreshCw
} from 'lucide-react';

import { apiService } from '../services/apiService';
import InvestmentDetail from './InvestmentDetail';

const ListContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ListHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
`;

const ListTitle = styled.h3`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const FilterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: #666;
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 120px;
  background: white;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchButton = styled(ActionButton)`
  background: #667eea;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6fd8;
  }
`;

const RefreshButton = styled(ActionButton)`
  background: #6c757d;
  color: white;

  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
  white-space: nowrap;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  vertical-align: top;
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

const Amount = styled.span`
  font-weight: 600;
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: white;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ViewButton = styled(IconButton)`
  background: #17a2b8;

  &:hover:not(:disabled) {
    background: #138496;
  }
`;

const EditButton = styled(IconButton)`
  background: #ffc107;
  color: #212529;

  &:hover:not(:disabled) {
    background: #e0a800;
  }
`;

const DeleteButton = styled(IconButton)`
  background: #dc3545;

  &:hover:not(:disabled) {
    background: #c82333;
  }
`;

const ApproveButton = styled(IconButton)`
  background: #28a745;

  &:hover:not(:disabled) {
    background: #218838;
  }
`;

const RejectButton = styled(IconButton)`
  background: #dc3545;

  &:hover:not(:disabled) {
    background: #c82333;
  }
`;

const PendingButton = styled(IconButton)`
  background: #ffc107;
  color: #212529;

  &:hover:not(:disabled) {
    background: #e0a800;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: #666;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #666;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  color: #333;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #f8f9fa;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &.active {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
`;

const StatusModal = styled.div`
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.3rem;
`;

const ModalSubtitle = styled.p`
  margin: 0;
  color: #666;
  font-size: 0.9rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
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
 * InvestmentList Component
 * 투자비 요청 목록 표시 및 관리
 */
function InvestmentList({ user, showActions = true, limit = null, onStatusChange }) {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    company: '',
    month: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: limit || 10,
    total: 0
  });
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [statusModal, setStatusModal] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    loadInvestments();
  }, [filters, pagination.page]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * 투자비 요청 목록 로드
   */
  const loadInvestments = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };

      const response = await apiService.getInvestments(params);
      setInvestments(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }));
    } catch (err) {
      console.error('Load investments error:', err);
      setError(err.message || '투자비 요청 목록을 불러올 수 없습니다.');
      toast.error('데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 필터 변경 처리
   */
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };

  /**
   * 검색 실행
   */
  const handleSearch = () => {
    loadInvestments();
  };

  /**
   * 새로고침
   */
  const handleRefresh = () => {
    loadInvestments();
  };

  /**
   * 상태 변경 모달 열기
   */
  const openStatusModal = (investment, status) => {
    setSelectedInvestment(investment);
    setStatusModal(status);
    setAdminComment('');
  };

  /**
   * 상태 변경 모달 닫기
   */
  const closeStatusModal = () => {
    setSelectedInvestment(null);
    setStatusModal(null);
    setAdminComment('');
  };

  /**
   * 상태 변경 확인
   */
  const handleStatusConfirm = async () => {
    if (!selectedInvestment || !statusModal) return;

    try {
      await apiService.updateInvestmentStatus(
        selectedInvestment.id,
        statusModal,
        adminComment
      );

      toast.success(`투자비 요청이 ${statusModal === 'Approved' ? '승인' : statusModal === 'Rejected' ? '거절' : '보류'}되었습니다.`);
      
      closeStatusModal();
      loadInvestments();
      
      if (onStatusChange) {
        onStatusChange(selectedInvestment.id, statusModal, adminComment);
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error.message || '상태 변경에 실패했습니다.');
    }
  };

  /**
   * 투자비 요청 삭제
   */
  const handleDelete = async (id) => {
    if (!window.confirm('정말로 이 투자비 요청을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await apiService.deleteInvestment(id);
      toast.success('투자비 요청이 삭제되었습니다.');
      loadInvestments();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || '삭제에 실패했습니다.');
    }
  };

  /**
   * 투자비 요청 상태 변경 처리
   */
  const handleStatusChange = async (id, status, adminComment = '') => {
    try {
      await apiService.updateInvestmentStatus(id, status, adminComment);
      toast.success(`투자비 요청이 ${status === 'Approved' ? '승인' : status === 'Rejected' ? '거절' : '보류'}되었습니다.`);
      loadInvestments();
      
      if (onStatusChange) {
        onStatusChange(id, status, adminComment);
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error.message || '상태 변경에 실패했습니다.');
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
  const renderActionButtons = (investment) => {
    const isOwner = investment.fields?.RequestedBy === user?.email;
    const isAdmin = user?.isAdmin;

    return (
      <ActionButtons>
        <ViewButton
          title="상세보기"
          onClick={() => {
            setSelectedInvestment(investment);
            setShowDetailModal(true);
          }}
        >
          <Eye size={16} />
        </ViewButton>

        {(isOwner || isAdmin) && (
          <EditButton
            title="수정"
            onClick={() => {
              // 수정 로직 구현
              toast.info('수정 기능은 추후 구현됩니다.');
            }}
          >
            <Edit size={16} />
          </EditButton>
        )}

        {(isOwner || isAdmin) && (
          <DeleteButton
            title="삭제"
            onClick={() => handleDelete(investment.id)}
          >
            <Trash2 size={16} />
          </DeleteButton>
        )}

        {isAdmin && showActions && (
          <>
            <ApproveButton
              title="승인"
              onClick={() => openStatusModal(investment, 'Approved')}
            >
              <CheckCircle size={16} />
            </ApproveButton>

            <RejectButton
              title="거절"
              onClick={() => openStatusModal(investment, 'Rejected')}
            >
              <XCircle size={16} />
            </RejectButton>

            <PendingButton
              title="보류"
              onClick={() => openStatusModal(investment, 'Pending')}
            >
              <Clock size={16} />
            </PendingButton>
          </>
        )}
      </ActionButtons>
    );
  };

  if (loading) {
    return (
      <ListContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>데이터를 불러오는 중...</span>
        </LoadingSpinner>
      </ListContainer>
    );
  }

  return (
    <>
      <ListContainer>
        <ListHeader>
          <ListTitle>투자비 요청 목록</ListTitle>
          
          <FilterSection>
            <FilterGroup>
              <FilterLabel>검색</FilterLabel>
              <FilterInput
                type="text"
                placeholder="제목, 담당자 검색"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>상태</FilterLabel>
              <FilterSelect
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">전체</option>
                <option value="Pending">대기</option>
                <option value="Approved">승인</option>
                <option value="Rejected">거절</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>법인</FilterLabel>
              <FilterSelect
                value={filters.company}
                onChange={(e) => handleFilterChange('company', e.target.value)}
              >
                <option value="">전체</option>
                <option value="한국법인">한국법인</option>
                <option value="미국법인">미국법인</option>
                <option value="유럽법인">유럽법인</option>
                <option value="중국법인">중국법인</option>
                <option value="일본법인">일본법인</option>
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>사용월</FilterLabel>
              <FilterInput
                type="month"
                value={filters.month}
                onChange={(e) => handleFilterChange('month', e.target.value)}
              />
            </FilterGroup>

            <SearchButton onClick={handleSearch}>
              <Search size={16} />
              검색
            </SearchButton>

            <RefreshButton onClick={handleRefresh}>
              <RefreshCw size={16} />
              새로고침
            </RefreshButton>
          </FilterSection>
        </ListHeader>

        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>제목</TableHeaderCell>
                <TableHeaderCell>법인</TableHeaderCell>
                <TableHeaderCell>담당팀</TableHeaderCell>
                <TableHeaderCell>담당자</TableHeaderCell>
                <TableHeaderCell>금액</TableHeaderCell>
                <TableHeaderCell>상태</TableHeaderCell>
                <TableHeaderCell>요청일</TableHeaderCell>
                {showActions && <TableHeaderCell>액션</TableHeaderCell>}
              </tr>
            </TableHeader>
            <TableBody>
              {investments.length === 0 ? (
                <tr>
                  <TableCell colSpan={showActions ? 8 : 7}>
                    <EmptyState>
                      <p>투자비 요청이 없습니다.</p>
                    </EmptyState>
                  </TableCell>
                </tr>
              ) : (
                investments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                        {investment.fields?.Title || '제목 없음'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        {investment.fields?.Category || '카테고리 없음'}
                      </div>
                    </TableCell>
                    <TableCell>{investment.fields?.Company || '-'}</TableCell>
                    <TableCell>{investment.fields?.Team || '-'}</TableCell>
                    <TableCell>{investment.fields?.User || '-'}</TableCell>
                    <TableCell>
                      <Amount>
                        {investment.fields?.Amount ? 
                          `${parseInt(investment.fields.Amount).toLocaleString()}원` : 
                          '-'
                        }
                      </Amount>
                    </TableCell>
                    <TableCell>
                      {renderStatusBadge(investment.fields?.Status)}
                    </TableCell>
                    <TableCell>
                      {investment.fields?.RequestedDate ? 
                        new Date(investment.fields.RequestedDate).toLocaleDateString('ko-KR') : 
                        '-'
                      }
                    </TableCell>
                    {showActions && (
                      <TableCell>
                        {renderActionButtons(investment)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {pagination.total > pagination.limit && (
          <Pagination>
            <PageButton
              disabled={pagination.page === 1}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              이전
            </PageButton>
            
            <span>
              {pagination.page} / {Math.ceil(pagination.total / pagination.limit)}
            </span>
            
            <PageButton
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              다음
            </PageButton>
          </Pagination>
        )}
      </ListContainer>

      {/* 상태 변경 모달 */}
      {statusModal && selectedInvestment && (
        <StatusModal onClick={closeStatusModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                투자비 요청 {statusModal === 'Approved' ? '승인' : statusModal === 'Rejected' ? '거절' : '보류'}
              </ModalTitle>
              <ModalSubtitle>
                {selectedInvestment.fields?.Title}
              </ModalSubtitle>
            </ModalHeader>

            <FormGroup>
              <Label>관리자 의견</Label>
              <TextArea
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                placeholder="승인/거절/보류 사유를 입력하세요..."
              />
            </FormGroup>

            <ModalActions>
              <CancelButton onClick={closeStatusModal}>
                취소
              </CancelButton>
              <ConfirmButton onClick={handleStatusConfirm}>
                {statusModal === 'Approved' ? '승인' : statusModal === 'Rejected' ? '거절' : '보류'}
              </ConfirmButton>
            </ModalActions>
          </ModalContent>
        </StatusModal>
      )}

      {/* 투자비 상세보기 모달 */}
      {showDetailModal && selectedInvestment && (
        <InvestmentDetail
          investment={selectedInvestment}
          user={user}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInvestment(null);
          }}
          onStatusChange={handleStatusChange}
          onEdit={(investment) => {
            // 수정 기능 구현
            toast.info('수정 기능은 추후 구현됩니다.');
          }}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}

export default InvestmentList;
