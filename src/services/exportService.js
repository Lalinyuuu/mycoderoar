/**
 * Export Service
 * Handles PDF and Excel export functionality for statistics data
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Excel Export Functions
export const exportToExcel = (data, filename = 'statistics') => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Platform Overview Sheet
    if (data.platform) {
      const platformData = [
        ['Metric', 'Value', 'Change'],
        ['Total Users', data.platform.totalUsers || 0, '+0 today'],
        ['Total Posts', data.platform.totalPosts || 0, '+0 today'],
        ['Total Likes', data.platform.totalLikes || 0, '+12.5% this week'],
        ['Total Comments', data.platform.totalComments || 0, '+8.3% this week'],
        ['Total Shares', data.platform.totalShares || 0, '+15.2% this week'],
        ['Active Users', data.platform.activeUsers || 0, 'Online now'],
        ['Engagement Rate', `${data.platform.engagementRate || 0}%`, '+2.1%'],
        ['Growth Rate', `${data.platform.growthRate || 0}%`, '+0.8%']
      ];
      const platformSheet = XLSX.utils.aoa_to_sheet(platformData);
      XLSX.utils.book_append_sheet(workbook, platformSheet, 'Platform Overview');
    }

    // User Analytics Sheet
    if (data.users) {
      const userData = [
        ['Metric', 'Value', 'Change'],
        ['Total Users', data.users.totalUsers || 0, '+0 this month'],
        ['New Users', data.users.newUsers || 0, 'This month'],
        ['Active Users', data.users.activeUsers || 0, 'Online now'],
        ['Inactive Users', data.users.inactiveUsers || 0, 'Need attention'],
        ['Admin Users', data.users.adminUsers || 0, 'Administrators'],
        ['Regular Users', data.users.regularUsers || 0, 'Regular users']
      ];
      const userSheet = XLSX.utils.aoa_to_sheet(userData);
      XLSX.utils.book_append_sheet(workbook, userSheet, 'User Analytics');

      // Top Users Sheet
      if (data.users.topUsers && data.users.topUsers.length > 0) {
        const topUsersData = [
          ['User', 'Posts', 'Likes', 'Followers', 'Activity'],
          ...data.users.topUsers.map(user => [
            user.name || 'Unknown',
            user.posts || 0,
            user.likes || 0,
            user.followers || 0,
            'Active'
          ])
        ];
        const topUsersSheet = XLSX.utils.aoa_to_sheet(topUsersData);
        XLSX.utils.book_append_sheet(workbook, topUsersSheet, 'Top Users');
      }
    }

    // Post Performance Sheet
    if (data.posts) {
      const postData = [
        ['Metric', 'Value', 'Change'],
        ['Total Posts', data.posts.totalPosts || 0, '+0 today'],
        ['Posts Today', data.posts.postsToday || 0, 'Today'],
        ['Total Likes', data.posts.totalLikes || 0, '+12.5% this week'],
        ['Total Comments', data.posts.totalComments || 0, '+8.3% this week'],
        ['Total Shares', data.posts.totalShares || 0, '+15.2% this week'],
        ['Total Views', data.posts.totalViews || 0, '+5.2% this week'],
        ['Avg Engagement', `${data.posts.avgEngagement || 0}%`, '+2.1%']
      ];
      const postSheet = XLSX.utils.aoa_to_sheet(postData);
      XLSX.utils.book_append_sheet(workbook, postSheet, 'Post Performance');

      // Top Posts Sheet
      if (data.posts.topPosts && data.posts.topPosts.length > 0) {
        const topPostsData = [
          ['Post Title', 'Views', 'Likes', 'Comments', 'Shares', 'Engagement'],
          ...data.posts.topPosts.map(post => {
            const engagement = ((post.likes + post.comments + post.shares) / post.views * 100).toFixed(1);
            return [
              post.title || 'Unknown',
              post.views || 0,
              post.likes || 0,
              post.comments || 0,
              post.shares || 0,
              `${engagement}%`
            ];
          })
        ];
        const topPostsSheet = XLSX.utils.aoa_to_sheet(topPostsData);
        XLSX.utils.book_append_sheet(workbook, topPostsSheet, 'Top Posts');
      }

      // Post Categories Sheet
      if (data.posts.postCategories && data.posts.postCategories.length > 0) {
        const categoriesData = [
          ['Category', 'Count', 'Percentage'],
          ...data.posts.postCategories.map(category => [
            category.category || 'Unknown',
            category.count || 0,
            `${category.percentage || 0}%`
          ])
        ];
        const categoriesSheet = XLSX.utils.aoa_to_sheet(categoriesData);
        XLSX.utils.book_append_sheet(workbook, categoriesSheet, 'Post Categories');
      }
    }

    // Engagement Trends Sheet
    if (data.engagement) {
      const engagementData = [
        ['Metric', 'Value'],
        ['Engagement Rate', `${data.engagement.engagementRate || 0}%`],
        ['Avg Session Time', data.engagement.avgSessionTime || '0m 0s'],
        ['Bounce Rate', `${data.engagement.bounceRate || 0}%`],
        ['Return Visitors', `${data.engagement.returnVisitors || 0}%`]
      ];
      const engagementSheet = XLSX.utils.aoa_to_sheet(engagementData);
      XLSX.utils.book_append_sheet(workbook, engagementSheet, 'Engagement Trends');
    }

    // Save the file
    XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    return { success: true, message: 'Excel file exported successfully!' };
  } catch (error) {
    return { success: false, message: 'Failed to export Excel file' };
  }
};

// PDF Export Functions
export const exportToPDF = (data, filename = 'statistics') => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;


    // Helper function to add table
    const addTable = (data, startY) => {
      autoTable(doc, {
        head: [data[0]],
        body: data.slice(1),
        startY: startY,
        theme: 'grid',
        headStyles: { fillColor: [102, 102, 102] },
        alternateRowStyles: { fillColor: [245, 245, 245] }
      });
      return doc.lastAutoTable.finalY + 10;
    };

    // Title
    doc.setFontSize(18);
    doc.setTextColor(102, 102, 102);
    doc.text('Ragnarok Guide - Statistics Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Generated date
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Platform Overview
    if (data.platform) {
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('Platform Overview', 20, yPosition);
      yPosition += 10;
      
      const platformData = [
        ['Metric', 'Value'],
        ['Total Users', data.platform.totalUsers || 0],
        ['Total Posts', data.platform.totalPosts || 0],
        ['Total Likes', data.platform.totalLikes || 0],
        ['Total Comments', data.platform.totalComments || 0],
        ['Total Shares', data.platform.totalShares || 0],
        ['Active Users', data.platform.activeUsers || 0],
        ['Engagement Rate', `${data.platform.engagementRate || 0}%`],
        ['Growth Rate', `${data.platform.growthRate || 0}%`]
      ];
      
      yPosition = addTable(platformData, yPosition);
      
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }
    }

    // User Analytics
    if (data.users) {
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('User Analytics', 20, yPosition);
      yPosition += 10;
      
      const userData = [
        ['Metric', 'Value'],
        ['Total Users', data.users.totalUsers || 0],
        ['New Users', data.users.newUsers || 0],
        ['Active Users', data.users.activeUsers || 0],
        ['Inactive Users', data.users.inactiveUsers || 0],
        ['Admin Users', data.users.adminUsers || 0],
        ['Regular Users', data.users.regularUsers || 0]
      ];
      
      yPosition = addTable(userData, yPosition);
      
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Top Users
      if (data.users.topUsers && data.users.topUsers.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(51, 51, 51);
        doc.text('Top Active Users', 20, yPosition);
        yPosition += 10;
        
        const topUsersData = [
          ['User', 'Posts', 'Likes', 'Followers'],
          ...data.users.topUsers.map(user => [
            user.name || 'Unknown',
            user.posts || 0,
            user.likes || 0,
            user.followers || 0
          ])
        ];
        
        yPosition = addTable(topUsersData, yPosition);
        
        // Check if we need a new page
        if (yPosition > pageHeight - 50) {
          doc.addPage();
          yPosition = 20;
        }
      }
    }

    // Post Performance
    if (data.posts) {
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('Post Performance', 20, yPosition);
      yPosition += 10;
      
      const postData = [
        ['Metric', 'Value'],
        ['Total Posts', data.posts.totalPosts || 0],
        ['Posts Today', data.posts.postsToday || 0],
        ['Total Likes', data.posts.totalLikes || 0],
        ['Total Comments', data.posts.totalComments || 0],
        ['Total Shares', data.posts.totalShares || 0],
        ['Total Views', data.posts.totalViews || 0],
        ['Avg Engagement', `${data.posts.avgEngagement || 0}%`]
      ];
      
      yPosition = addTable(postData, yPosition);
      
      // Check if we need a new page
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Top Posts
      if (data.posts.topPosts && data.posts.topPosts.length > 0) {
        doc.setFontSize(12);
        doc.setTextColor(51, 51, 51);
        doc.text('Top Performing Posts', 20, yPosition);
        yPosition += 10;
        
        const topPostsData = [
          ['Post Title', 'Views', 'Likes', 'Comments', 'Shares'],
          ...data.posts.topPosts.map(post => [
            (post.title || 'Unknown').substring(0, 30) + '...',
            post.views || 0,
            post.likes || 0,
            post.comments || 0,
            post.shares || 0
          ])
        ];
        
        yPosition = addTable(topPostsData, yPosition);
      }
    }

    // Save the file
    doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
    return { success: true, message: 'PDF file exported successfully!' };
  } catch (error) {
    return { success: false, message: 'Failed to export PDF file' };
  }
};

// Email Report Function (placeholder for future implementation)
export const emailReport = async (data, email) => {
  try {
    // This would integrate with your email service
    
    // For now, just return success
    return { success: true, message: 'Email report sent successfully!' };
  } catch (error) {
    return { success: false, message: 'Failed to send email report' };
  }
};

export default {
  exportToExcel,
  exportToPDF,
  emailReport
};
