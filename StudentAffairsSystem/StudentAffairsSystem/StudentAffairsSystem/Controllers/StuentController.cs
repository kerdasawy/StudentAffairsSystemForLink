﻿// =============================
// Email: info@ebenmonney.com
// www.ebenmonney.com/templates
// =============================

using AutoMapper;

using DAL;
using DAL.Models;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using StudentAffairsSystem.Helpers;
using StudentAffairsSystem.ViewModels;

using System.Linq;

namespace StudentAffairsSystem.Controllers
{
    [Route("api/[controller]")]
    public class StuentController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;
        private readonly IEmailSender _emailSender;


        public StuentController(IMapper mapper, IUnitOfWork unitOfWork, ILogger<CustomerController> logger, IEmailSender emailSender)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
            _logger = logger;
            _emailSender = emailSender;
        }

        [HttpPost("CreateStudent")]
        public  IActionResult CreateStudent(StudentFormViewModel studentViewModel)
        {
            if (!ModelState.IsValid)
            {
                  
            }
            var studentModel = this._mapper.Map<Student>(studentViewModel);
            this._unitOfWork.Stuents.Add(studentModel);
            this._unitOfWork.SaveChanges();

            return Ok();
            
        }

        [HttpGet("StudentList")]

        public IActionResult StudentList()
        {

            return StudentList(-1, -1,null);
        }
        [HttpGet("StudentList/{pageNumber:int}/{pageSize:int}/{nameFilter:string}")]

        public IActionResult StudentList(int pageNumber, int pageSize, string nameFilter)
        {
            IQueryable<Student> StudentQuery = null; ;
            if (nameFilter != null)
                StudentQuery = this._unitOfWork.Stuents.Find(x => x.Name.Contains(nameFilter));
            else
            {
                StudentQuery = this._unitOfWork.Stuents.Find(x=>true);
            }
            if (pageNumber > 0 && pageSize > 0)
            {
                StudentQuery = StudentQuery.Skip(pageNumber * pageSize).Take(pageSize);

            }
            var listResult = StudentQuery.ToList().Select(s=>this._mapper.Map<StudentListItemViewModel>(s)).ToList();
            ListResponse<StudentListItemViewModel> StudentList = new ListResponse<StudentListItemViewModel>() { 
            Items = listResult,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = listResult.Count
            };
            return Ok(StudentList);
        }

    }
}