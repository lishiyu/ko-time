package cn.langpy.kotime.config;



import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
@Component
@ConfigurationProperties(prefix = "ko-time")
public class DefaultConfig {
    private Boolean enable;
    private String logLanguage;
    private Boolean logEnable;
    private Double threshold;
    private String pointcut;
    private Boolean exceptionEnable;
    private String saveSaver;
    private Boolean saveAsync;
    private Integer threadNum;
    private String contextPath;

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }

    public String getLogLanguage() {
        return logLanguage;
    }

    public void setLogLanguage(String logLanguage) {
        this.logLanguage = logLanguage;
    }

    public Boolean getLogEnable() {
        return logEnable;
    }

    public void setLogEnable(Boolean logEnable) {
        this.logEnable = logEnable;
    }

    public Double getThreshold() {
        return threshold;
    }

    public void setThreshold(Double threshold) {
        this.threshold = threshold;
    }

    public String getPointcut() {
        return pointcut;
    }

    public void setPointcut(String pointcut) {
        this.pointcut = pointcut;
    }

    public Boolean getExceptionEnable() {
        return exceptionEnable;
    }

    public void setExceptionEnable(Boolean exceptionEnable) {
        this.exceptionEnable = exceptionEnable;
    }

    public String getSaveSaver() {
        return saveSaver;
    }

    public void setSaveSaver(String saveSaver) {
        this.saveSaver = saveSaver;
    }

    public Boolean getSaveAsync() {
        return saveAsync;
    }

    public void setSaveAsync(Boolean saveAsync) {
        this.saveAsync = saveAsync;
    }

    public Integer getThreadNum() {
        return threadNum;
    }

    public void setThreadNum(Integer threadNum) {
        this.threadNum = threadNum;
    }

    public String getContextPath() {
        return contextPath;
    }

    public void setContextPath(String contextPath) {
        this.contextPath = contextPath;
    }
}
