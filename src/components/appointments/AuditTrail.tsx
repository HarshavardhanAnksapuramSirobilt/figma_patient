import React, { useState, useEffect } from "react";
import { Shield, Eye, Edit, Trash2, Plus, Calendar, User, Clock } from "lucide-react";
import { getAuditTrails, getEntityAuditTrails } from "../../services/auditApis";
import { Button } from "../../commonfields/Button";
import { Select } from "../../commonfields/Select";
import { Input } from "../../commonfields/Input";
import { showError } from "../../utils/toastUtils";
import { AuditAction, auditActionOptions } from "../../types/appointmentenums";
import type { AuditTrail as AuditTrailType, AuditFilters } from "../../services/auditApis";

interface AuditTrailProps {
  entityType?: string;
  entityId?: string;
  facilityId?: string;
  showFilters?: boolean;
}

export const AuditTrail: React.FC<AuditTrailProps> = ({
  entityType,
  entityId,
  facilityId,
  showFilters = true
}) => {
  const [auditTrails, setAuditTrails] = useState<AuditTrailType[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<AuditFilters>({
    entityType,
    entityId,
    facilityId,
    page: 0,
    size: 20
  });
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAuditTrails();
  }, [filters]);

  const loadAuditTrails = async () => {
    setLoading(true);
    try {
      let response;
      if (entityType && entityId) {
        response = await getEntityAuditTrails(entityType, entityId);
      } else {
        response = await getAuditTrails(filters);
      }
      
      setAuditTrails(response.results || response || []);
      setTotalPages(response.totalPages || 0);
      setCurrentPage(response.page || 0);
    } catch (error) {
      console.error("Failed to load audit trails:", error);
      showError("Failed to load audit trails");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof AuditFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 0 // Reset to first page when filters change
    }));
  };

  const toggleExpanded = (auditId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(auditId)) {
        newSet.delete(auditId);
      } else {
        newSet.add(auditId);
      }
      return newSet;
    });
  };

  const getActionIcon = (action: AuditAction) => {
    switch (action) {
      case AuditAction.Create:
        return <Plus size={16} className="text-green-600" />;
      case AuditAction.Update:
        return <Edit size={16} className="text-blue-600" />;
      case AuditAction.Delete:
        return <Trash2 size={16} className="text-red-600" />;
      case AuditAction.View:
        return <Eye size={16} className="text-gray-600" />;
      case AuditAction.Cancel:
        return <Calendar size={16} className="text-orange-600" />;
      case AuditAction.Reschedule:
        return <Calendar size={16} className="text-purple-600" />;
      case AuditAction.Confirm:
        return <Calendar size={16} className="text-green-600" />;
      case AuditAction.Complete:
        return <Calendar size={16} className="text-blue-600" />;
      default:
        return <Shield size={16} className="text-gray-600" />;
    }
  };

  const getActionColor = (action: AuditAction): string => {
    switch (action) {
      case AuditAction.Create:
        return 'bg-green-100 text-green-800';
      case AuditAction.Update:
        return 'bg-blue-100 text-blue-800';
      case AuditAction.Delete:
        return 'bg-red-100 text-red-800';
      case AuditAction.View:
        return 'bg-gray-100 text-gray-800';
      case AuditAction.Cancel:
        return 'bg-orange-100 text-orange-800';
      case AuditAction.Reschedule:
        return 'bg-purple-100 text-purple-800';
      case AuditAction.Confirm:
        return 'bg-green-100 text-green-800';
      case AuditAction.Complete:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
  };

  const renderChanges = (audit: AuditTrailType) => {
    if (!audit.changes || audit.changes.length === 0) return null;

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Changes Made:</h4>
        <div className="space-y-2">
          {audit.changes.map((change, index) => (
            <div key={index} className="text-sm">
              <span className="font-medium text-gray-600">{change}</span>
              {audit.oldValues && audit.newValues && (
                <div className="ml-4 mt-1 text-xs text-gray-500">
                  <div>Old: {JSON.stringify(audit.oldValues[change]) || 'N/A'}</div>
                  <div>New: {JSON.stringify(audit.newValues[change]) || 'N/A'}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <Shield className="text-indigo-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-800">Audit Trail</h2>
        {entityType && entityId && (
          <span className="text-sm text-gray-600">
            for {entityType} {entityId}
          </span>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
            <Select
              value={filters.entityType || ""}
              onChange={(e) => handleFilterChange("entityType", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="appointment">Appointment</option>
              <option value="provider">Provider</option>
              <option value="patient">Patient</option>
              <option value="notification">Notification</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <Select
              value={filters.action?.[0] || ""}
              onChange={(e) => handleFilterChange("action", e.target.value ? [e.target.value] : undefined)}
            >
              <option value="">All Actions</option>
              {auditActionOptions.map((action) => (
                <option key={action} value={action}>{action}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <Input
              type="date"
              value={filters.dateFrom || ""}
              onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <Input
              type="date"
              value={filters.dateTo || ""}
              onChange={(e) => handleFilterChange("dateTo", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Audit Trail List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading audit trails...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {auditTrails.map((audit) => (
            <div
              key={audit.auditId}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    {getActionIcon(audit.action)}
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getActionColor(audit.action)}`}>
                      {audit.action}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {audit.entityType} {audit.entityId}
                      </h3>
                      <span className="text-xs text-gray-500">
                        by {audit.performedByName || audit.performedBy}
                      </span>
                    </div>
                    
                    {audit.description && (
                      <p className="text-sm text-gray-600 mb-2">{audit.description}</p>
                    )}

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatDateTime(audit.timestamp)}</span>
                      </div>
                      {audit.ipAddress && (
                        <span>IP: {audit.ipAddress}</span>
                      )}
                      {audit.sessionId && (
                        <span>Session: {audit.sessionId.slice(0, 8)}...</span>
                      )}
                    </div>

                    {expandedItems.has(audit.auditId!) && renderChanges(audit)}
                  </div>
                </div>

                {(audit.changes && audit.changes.length > 0) && (
                  <Button
                    onClick={() => toggleExpanded(audit.auditId!)}
                    className="ml-2 px-2 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
                  >
                    {expandedItems.has(audit.auditId!) ? 'Hide' : 'Details'}
                  </Button>
                )}
              </div>
            </div>
          ))}

          {auditTrails.length === 0 && (
            <div className="text-center py-8">
              <Shield className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No audit trails found</h3>
              <p className="text-gray-500">No audit records match your current filters</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleFilterChange("page", Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </Button>
            <Button
              onClick={() => handleFilterChange("page", Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage >= totalPages - 1}
              className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
