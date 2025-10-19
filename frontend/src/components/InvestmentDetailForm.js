import React, { useState } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, DollarSign } from 'lucide-react';

const DetailFormContainer = styled.div`
  margin-top: 1rem;
`;

const DetailFormTitle = styled.h4`
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px 150px 100px;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #f8f9fa;
`;

const DetailInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const AmountInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: right;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
  }
`;

const ActionButton = styled.button`
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

const RemoveButton = styled(ActionButton)`
  background: #dc3545;

  &:hover:not(:disabled) {
    background: #c82333;
  }
`;

const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: #5a6fd8;
    transform: translateY(-1px);
  }
`;

const SummaryCard = styled.div`
  background: #e3f2fd;
  border: 1px solid #2196f3;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
`;

const SummaryTitle = styled.h5`
  margin: 0 0 0.5rem 0;
  color: #1976d2;
  font-size: 0.9rem;
  font-weight: 600;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  font-weight: 600;
  color: #333;
`;

const DifferenceValue = styled.span`
  font-weight: 600;
  color: ${props => props.difference === 0 ? '#28a745' : props.difference > 0 ? '#dc3545' : '#ffc107'};
`;

/**
 * InvestmentDetailForm Component
 * 투자비 내역 상세 입력 폼
 */
function InvestmentDetailForm({ value, onChange, totalAmount }) {
  const [details, setDetails] = useState(value || []);

  /**
   * 상세 항목 추가
   */
  const addDetailItem = () => {
    const newDetails = [...details, { description: '', amount: 0 }];
    setDetails(newDetails);
    onChange(newDetails);
  };

  /**
   * 상세 항목 제거
   */
  const removeDetailItem = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails);
    onChange(newDetails);
  };

  /**
   * 상세 항목 업데이트
   */
  const updateDetailItem = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index] = {
      ...newDetails[index],
      [field]: field === 'amount' ? parseFloat(value) || 0 : value
    };
    setDetails(newDetails);
    onChange(newDetails);
  };

  /**
   * 상세 금액 합계 계산
   */
  const detailTotal = details.reduce((sum, item) => sum + (item.amount || 0), 0);

  /**
   * 차액 계산
   */
  const difference = totalAmount - detailTotal;

  return (
    <DetailFormContainer>
      <DetailFormTitle>
        <DollarSign size={16} />
        투자비 내역 상세
      </DetailFormTitle>

      {details.map((item, index) => (
        <DetailItem key={index}>
          <DetailInput
            type="text"
            placeholder="내역 설명"
            value={item.description || ''}
            onChange={(e) => updateDetailItem(index, 'description', e.target.value)}
          />
          <AmountInput
            type="number"
            placeholder="금액"
            value={item.amount || ''}
            onChange={(e) => updateDetailItem(index, 'amount', e.target.value)}
            min="0"
            step="1"
          />
          <AmountInput
            type="text"
            value={item.amount ? `${parseInt(item.amount).toLocaleString()}원` : '0원'}
            readOnly
            style={{ backgroundColor: '#f8f9fa', color: '#666' }}
          />
          <RemoveButton
            onClick={() => removeDetailItem(index)}
            disabled={details.length <= 1}
            title="항목 삭제"
          >
            <Trash2 size={14} />
          </RemoveButton>
        </DetailItem>
      ))}

      <AddItemButton onClick={addDetailItem}>
        <Plus size={16} />
        항목 추가
      </AddItemButton>

      <SummaryCard>
        <SummaryTitle>투자비 내역 요약</SummaryTitle>
        <SummaryRow>
          <SummaryLabel>투자비 금액:</SummaryLabel>
          <SummaryValue>{parseInt(totalAmount || 0).toLocaleString()}원</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>상세 내역 합계:</SummaryLabel>
          <SummaryValue>{parseInt(detailTotal).toLocaleString()}원</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>차액:</SummaryLabel>
          <DifferenceValue difference={difference}>
            {difference === 0 ? '0원 (일치)' : 
             difference > 0 ? `+${parseInt(difference).toLocaleString()}원 (부족)` : 
             `${parseInt(difference).toLocaleString()}원 (초과)`}
          </DifferenceValue>
        </SummaryRow>
      </SummaryCard>
    </DetailFormContainer>
  );
}

export default InvestmentDetailForm;
