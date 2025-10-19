import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Users, DollarSign, Clock, CheckCircle, XCircle, AlertCircle,
  Building, Calendar, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon
} from 'lucide-react';

import { apiService } from '../services/apiService';
import InvestmentList from './InvestmentList';

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const DashboardHeader = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  text-align: center;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DashboardSubtitle = styled.p`
  opacity: 0.9;
  font-size: 1.1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  background: ${props => props.color || '#667eea'};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ChartCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
`;

const ChartContainer = styled.div`
  height: 300px;
  width: 100%;
`;

const TabContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TabHeader = styled.div`
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 1rem;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#666'};
  font-weight: ${props => props.active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid ${props => props.active ? '#667eea' : 'transparent'};

  &:hover {
    background: ${props => props.active ? 'white' : '#f0f0f0'};
  }
`;

const TabContent = styled.div`
  padding: 1.5rem;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.1rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 차트 색상 정의
const COLORS = {
  pending: '#ffc107',
  approved: '#28a745',
  rejected: '#dc3545',
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#17a2b8'
};

const PIE_COLORS = [COLORS.pending, COLORS.approved, COLORS.rejected];

/**
 * Dashboard Component
 * 관리자 대시보드 - 통계 및 차트 표시
 */
function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [recentInvestments, setRecentInvestments] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  /**
   * 대시보드 데이터 로드
   */
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsResponse, recentResponse] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentInvestments(10)
      ]);

      setStats(statsResponse.data);
      setRecentInvestments(recentResponse.data);
    } catch (error) {
      console.error('Dashboard data loading error:', error);
      setError(error.message || '대시보드 데이터 로딩에 실패했습니다.');
      toast.error('대시보드 데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 투자비 요청 상태 변경 처리
   */
  const handleStatusChange = async (id, status, adminComment = '') => {
    try {
      await apiService.updateInvestmentStatus(id, status, adminComment);
      toast.success(`투자비 요청이 ${status === 'Approved' ? '승인' : status === 'Rejected' ? '거절' : '보류'}되었습니다.`);
      loadDashboardData(); // 데이터 새로고침
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error.message || '상태 변경에 실패했습니다.');
    }
  };

  /**
   * 통계 카드 렌더링
   */
  const renderStatCards = () => {
    if (!stats) return null;

    return (
      <StatsGrid>
        <StatCard>
          <StatIcon color={COLORS.primary}>
            <DollarSign size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalAmount.toLocaleString()}원</StatValue>
            <StatLabel>총 투자비</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color={COLORS.info}>
            <TrendingUp size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.totalInvestments}</StatValue>
            <StatLabel>총 요청 건수</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color={COLORS.success}>
            <CheckCircle size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.statusStats.Approved.count}</StatValue>
            <StatLabel>승인된 요청</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <StatIcon color={COLORS.warning}>
            <Clock size={24} />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.statusStats.Pending.count}</StatValue>
            <StatLabel>대기 중인 요청</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>
    );
  };

  /**
   * 승인 상태별 파이 차트 렌더링
   */
  const renderStatusPieChart = () => {
    if (!stats) return null;

    const pieData = [
      { name: '승인', value: stats.statusStats.Approved.count, amount: stats.statusStats.Approved.amount },
      { name: '대기', value: stats.statusStats.Pending.count, amount: stats.statusStats.Pending.amount },
      { name: '거절', value: stats.statusStats.Rejected.count, amount: stats.statusStats.Rejected.amount }
    ];

    return (
      <ChartCard>
        <ChartHeader>
          <PieChartIcon size={20} />
          승인 상태별 분포
        </ChartHeader>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name} ${value}건 (${(percent * 100).toFixed(1)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>
    );
  };

  /**
   * 법인별 투자비 바 차트 렌더링
   */
  const renderCompanyBarChart = () => {
    if (!stats) return null;

    return (
      <ChartCard>
        <ChartHeader>
          <Building size={20} />
          법인별 투자비 합계
        </ChartHeader>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.companyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()}원`, '투자비']}
                labelFormatter={(label) => `법인: ${label}`}
              />
              <Bar dataKey="amount" fill={COLORS.primary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>
    );
  };

  /**
   * 월별 투자비 추이 라인 차트 렌더링
   */
  const renderMonthlyLineChart = () => {
    if (!stats) return null;

    return (
      <ChartCard>
        <ChartHeader>
          <LineChartIcon size={20} />
          월별 투자비 추이
        </ChartHeader>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={stats.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()}원`, '투자비']}
                labelFormatter={(label) => `월: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke={COLORS.primary} 
                fill={COLORS.primary}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>
    );
  };

  /**
   * 카테고리별 투자비 차트 렌더링
   */
  const renderCategoryChart = () => {
    if (!stats) return null;

    return (
      <ChartCard>
        <ChartHeader>
          <BarChart3 size={20} />
          카테고리별 투자비
        </ChartHeader>
        <ChartContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.categoryStats} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="category" type="category" width={100} />
              <Tooltip 
                formatter={(value) => [`${value.toLocaleString()}원`, '투자비']}
                labelFormatter={(label) => `카테고리: ${label}`}
              />
              <Bar dataKey="amount" fill={COLORS.secondary} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </ChartCard>
    );
  };

  if (loading) {
    return (
      <DashboardContainer>
        <LoadingSpinner>
          <div className="spinner"></div>
          <span style={{ marginLeft: '10px' }}>대시보드 데이터를 불러오는 중...</span>
        </LoadingSpinner>
      </DashboardContainer>
    );
  }

  if (error) {
    return (
      <DashboardContainer>
        <ErrorMessage>
          <AlertCircle size={18} />
          {error}
        </ErrorMessage>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <DashboardHeader>
        <DashboardTitle>투자비 승인 대시보드</DashboardTitle>
        <DashboardSubtitle>관리자 전용 통계 및 승인 관리</DashboardSubtitle>
      </DashboardHeader>

      {renderStatCards()}

      <ChartsGrid>
        {renderStatusPieChart()}
        {renderCompanyBarChart()}
        {renderMonthlyLineChart()}
        {renderCategoryChart()}
      </ChartsGrid>

      <TabContainer>
        <TabHeader>
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            최근 요청
          </TabButton>
          <TabButton 
            active={activeTab === 'management'} 
            onClick={() => setActiveTab('management')}
          >
            승인 관리
          </TabButton>
        </TabHeader>

        <TabContent>
          {activeTab === 'overview' ? (
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>최근 투자비 요청</h3>
              <InvestmentList 
                user={user} 
                showActions={false}
                limit={10}
                onStatusChange={handleStatusChange}
              />
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '1rem', color: '#333' }}>투자비 승인 관리</h3>
              <InvestmentList 
                user={user} 
                showActions={true}
                onStatusChange={handleStatusChange}
              />
            </div>
          )}
        </TabContent>
      </TabContainer>
    </DashboardContainer>
  );
}

export default Dashboard;
