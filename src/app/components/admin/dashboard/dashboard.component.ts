import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from '../../../material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DashboardService } from '../../../services/dashboard.service';
import { StatusService } from '../../../services/status.service';
import {
  DashboardData,
  MonthlyDashboardData,
  TopSuppliersByRevenue,
} from '../../../models/dashboard.model';
import { BaseResponse } from '../../../models/base.model';
import { HttpErrorResponse } from '@angular/common/http';
import { VNDCurrencyPipe } from '../../../pipes/vnd-currency.pipe';
import { DataService } from '../../../services/data.service';
import { CommonModule } from '@angular/common';

export interface Chart {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
  grid: ApexGrid;
  marker: ApexMarkers;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    NgApexchartsModule,
    MatTableModule,
    VNDCurrencyPipe,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  public revenueChat!: Partial<ChartOptions> | any;
  public orderChart!: Partial<Chart> | any;
  public supplierChart!: Partial<Chart> | any;
  topSuppliers: TopSuppliersByRevenue[] = [];
  dashboardData: DashboardData | null = null;
  monthlyDashboardData: MonthlyDashboardData[] = [];
  months: string[] = [];
  dataSource: MatTableDataSource<TopSuppliersByRevenue> =
    new MatTableDataSource<TopSuppliersByRevenue>();
  displayedColumns: string[] = [
    'profile',
    'phoneNumber',
    'address',
    'totalPayment',
    'totalCompletedOrders',
    'averageRating',
  ];

  constructor(
    private dashboardService: DashboardService,
    private statusService: StatusService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.statusService.statusLoadingSpinnerSource.next(true);

    this.dataService.dashboardDataData$.subscribe(
      (data: DashboardData | null) => {
        if (data != null) {
          this.dashboardData = data;
        } else {
          this.getDashboardData();
        }
      }
    );

    this.dataService.monthlyDashboardDataData$.subscribe(
      (data: MonthlyDashboardData[] | null) => {
        if (data?.values) {
          this.monthlyDashboardData = data;
          this.updateMonthlyDashboardData();
        } else {
          this.getDashboardDataByMonth();
        }
      }
    );

    this.dataService.topSuppliersByRevenueData$.subscribe(
      (data: TopSuppliersByRevenue[] | null) => {
        if (data) {
          this.topSuppliers = data;
          this.dataSource = new MatTableDataSource(this.topSuppliers);
        } else {
          this.getTopSuppliers();
        }
      }
    );

    setTimeout(() => {
      this.statusService.statusLoadingSpinnerSource.next(false);
    }, 1000);
  }

  updateMonthlyDashboardData() {
    // sales overview chart
    this.revenueChat = {
      series: [
        {
          name: 'Revenue this month (VNĐ)',
          data: this.monthlyDashboardData.map((x) => x.totalRevenue),
        },
      ],
      chart: {
        type: 'bar',
        height: 370,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [this.monthlyDashboardData.map((x) => x.month)],
      },
      yaxis: {
        title: {
          text: '$ (thousands)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toLocaleString('vi-VN') + 'đ';
          },
        },
      },
    };

    // order chart
    this.orderChart = {
      series: [
        {
          name: '',
          color: '#fb977d',
          data: this.monthlyDashboardData.map((x) => x.totalOrders),
        },
      ],

      chart: {
        type: 'area',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 60,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#fb977d'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };

    // supplier chart
    this.supplierChart = {
      series: [
        {
          name: '',
          color: '#fb977d',
          data: this.monthlyDashboardData.map((x) => x.totalSuppliers),
        },
      ],

      chart: {
        type: 'area',
        fontFamily: 'inherit',
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 60,
        sparkline: {
          enabled: true,
        },
        group: 'sparklines',
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      fill: {
        colors: ['#fb977d'],
        type: 'solid',
        opacity: 0.05,
      },
      markers: {
        size: 0,
      },
      tooltip: {
        theme: 'dark',
        x: {
          show: false,
        },
      },
    };
  }

  getDashboardData() {
    this.dashboardService.getDashboardData().subscribe({
      next: (response: BaseResponse<DashboardData>) => {
        this.dashboardData = response.data;
        this.dataService.dashboardDataDataSource.next(this.dashboardData);
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  getDashboardDataByMonth() {
    this.dashboardService.getDashboardDataByMonth().subscribe({
      next: (response: BaseResponse<MonthlyDashboardData[]>) => {
        this.monthlyDashboardData = response.data;
        this.updateMonthlyDashboardData();
        this.dataService.monthlyDashboardDataDataSource.next(
          this.monthlyDashboardData
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }

  getTopSuppliers() {
    this.dashboardService.getTopSuppliers().subscribe({
      next: (response: BaseResponse<TopSuppliersByRevenue[]>) => {
        this.topSuppliers = response.data;
        this.dataSource = new MatTableDataSource(this.topSuppliers);
        this.dataService.topSuppliersByRevenueDataSource.next(
          this.topSuppliers
        );
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
      },
    });
  }
}
