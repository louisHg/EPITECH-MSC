package com.selenium.demo.entite;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class IndeedJob {

    private String jobTitle;
    private String jobCompName;
    private String jobLocation;
    private String jobDescriptions;

}
