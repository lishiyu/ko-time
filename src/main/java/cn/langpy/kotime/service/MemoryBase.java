package cn.langpy.kotime.service;

import cn.langpy.kotime.model.*;
import cn.langpy.kotime.util.Common;
import cn.langpy.kotime.util.Context;
import cn.langpy.kotime.util.MethodType;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

public class MemoryBase implements GraphService {

    private volatile static Map<String, MethodNode> methodNodes;

    private volatile static Map<String, ExceptionNode> exceptions;

    private volatile static Map<String, MethodRelation> methodRelations;

    private volatile static Map<String, ExceptionRelation> exceptionRelations;

    static {
        methodNodes = new HashMap<>();
        exceptions = new HashMap<>();
        methodRelations = new HashMap<>();
        exceptionRelations = new HashMap<>();
    }

    @Override
    public void addMethodNode(MethodNode methodNode) {
        if (!methodNodes.containsKey(methodNode.getId())) {
            methodNodes.put(methodNode.getId(), methodNode);
        }
    }


    @Override
    public MethodRelation addMethodRelation(MethodNode sourceMethodNode, MethodNode targetMethodNode) {
        MethodRelation methodRelation = new MethodRelation();
        methodRelation.setSourceId(sourceMethodNode.getId());
        methodRelation.setTargetId(targetMethodNode.getId());
        methodRelation.setId(sourceMethodNode.getId() + targetMethodNode.getId());
        methodRelation.setAvgRunTime(targetMethodNode.getValue());
        methodRelation.setMaxRunTime(targetMethodNode.getValue());
        methodRelation.setMinRunTime(targetMethodNode.getValue());
        Common.showLog(targetMethodNode.getId(), methodRelation);
        MethodRelation old = methodRelations.get(methodRelation.getId());
        if (null == old) {
            methodRelations.put(methodRelation.getId(), methodRelation);
            return methodRelation;
        } else {
            BigDecimal bg = BigDecimal.valueOf((methodRelation.getAvgRunTime() + old.getAvgRunTime()) / 2.0);
            double avg = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
            old.setAvgRunTime(avg);
            old.setMaxRunTime(methodRelation.getMaxRunTime() > old.getMaxRunTime() ? methodRelation.getMaxRunTime() : old.getMaxRunTime());
            old.setMinRunTime(methodRelation.getMinRunTime() < old.getMinRunTime() ? methodRelation.getMinRunTime() : old.getMinRunTime());
            return old;
        }
    }

    @Override
    public ExceptionRelation addExceptionRelation(MethodNode sourceMethodNode, ExceptionNode exceptionNode) {
        ExceptionRelation exceptionRelation = new ExceptionRelation();
        exceptionRelation.setId(sourceMethodNode.getId() + exceptionNode.getId());
        exceptionRelation.setSourceId(sourceMethodNode.getId());
        exceptionRelation.setTargetId(exceptionNode.getId());
        exceptionRelation.setExceptionNum(1);
        ExceptionRelation old = exceptionRelations.get(exceptionRelation.getId());
        if (null == old) {
            exceptionRelations.put(exceptionRelation.getId(), exceptionRelation);
            return exceptionRelation;
        } else {
            old.setExceptionNum(old.getExceptionNum() + 1);
            return old;
        }
    }

    @Override
    public void addExceptionNode(ExceptionNode exceptionNode) {
        if (!exceptions.containsKey(exceptionNode.getId())) {
            exceptions.put(exceptionNode.getId(), exceptionNode);
        }
    }

    @Override
    public List<ExceptionInfo> getExceptions(String methodId) {
        List<ExceptionInfo> exceptionInfos = new ArrayList<>();
        List<ExceptionRelation> relations = exceptionRelations.values().stream().filter(exceptionRelation -> exceptionRelation.getSourceId().equals(methodId)).collect(toList());
        for (ExceptionRelation relation : relations) {
            String exceptionId = relation.getTargetId();
            ExceptionNode exceptionNode = exceptions.get(exceptionId);
            ExceptionInfo exceptionInfo = new ExceptionInfo();
            exceptionInfo.setName(exceptionNode.getName());
            exceptionInfo.setClassName(exceptionNode.getClassName());
            exceptionInfo.setLocation(exceptionNode.getLocation());
            exceptionInfo.setMessage(exceptionNode.getMessage());
            exceptionInfo.setExceptionNum(relation.getExceptionNum());
            exceptionInfos.add(exceptionInfo);
        }
        return exceptionInfos;
    }

    @Override
    public List<MethodInfo> getControllers() {
        List<MethodInfo> methodInfos = new ArrayList<>();
        for (MethodNode methodNode : methodNodes.values()) {
            if (MethodType.Controller == methodNode.getMethodType()) {
                String id = methodNode.getId();
                MethodRelation relation = methodRelations.values().stream().filter(methodRelation -> methodRelation.getTargetId().equals(id)).findFirst().get();
                MethodInfo methodInfo = new MethodInfo();
                methodInfo.setName(methodNode.getName());
                methodInfo.setClassName(methodNode.getClassName());
                methodInfo.setMethodName(methodNode.getMethodName());
                methodInfo.setMethodType(methodNode.getMethodType());
                methodInfo.setValue(relation.getAvgRunTime());
                methodInfo.setAvgRunTime(relation.getAvgRunTime());
                methodInfo.setMaxRunTime(relation.getMaxRunTime());
                methodInfo.setMinRunTime(relation.getMinRunTime());
                methodInfos.add(methodInfo);
            }
        }
        return methodInfos;
    }

    @Override
    public List<MethodInfo> getChildren(String methodId) {
        List<MethodInfo> methodInfos = new ArrayList<>();
        for (MethodRelation methodRelation : methodRelations.values()) {
            if (methodRelation.getSourceId().equals(methodId)) {
                String targetMethodId = methodRelation.getTargetId();
                MethodNode methodNode = methodNodes.get(targetMethodId);
                MethodInfo methodInfo = new MethodInfo();
                methodInfo.setId(methodNode.getId());
                methodInfo.setName(methodNode.getName());
                methodInfo.setClassName(methodNode.getClassName());
                methodInfo.setMethodName(methodNode.getMethodName());
                methodInfo.setMethodType(methodNode.getMethodType());
                methodInfo.setValue(methodRelation.getAvgRunTime());
                methodInfo.setAvgRunTime(methodRelation.getAvgRunTime());
                methodInfo.setMaxRunTime(methodRelation.getMaxRunTime());
                methodInfo.setMinRunTime(methodRelation.getMinRunTime());
                methodInfos.add(methodInfo);
            }
        }
        return methodInfos;
    }

    public SystemStatistic getRunStatistic() {
        SystemStatistic systemStatistic = new SystemStatistic();
        List<MethodInfo> controllerApis = getControllers();
        if (null == controllerApis || controllerApis.size() == 0) {
            return systemStatistic;
        }
        int delayNum = (int) controllerApis.stream().filter(controllerApi -> controllerApi.getAvgRunTime() >= Context.getConfig().getTimeThreshold()).count();
        systemStatistic.setDelayNum(delayNum);
        int normalNum = (int) controllerApis.stream().filter(controllerApi -> controllerApi.getAvgRunTime() < Context.getConfig().getTimeThreshold()).count();
        systemStatistic.setNormalNum(normalNum);
        int totalNum = (int) controllerApis.stream().count();
        systemStatistic.setTotalNum(totalNum);
        Double max = controllerApis.stream().map(api -> api.getAvgRunTime()).max(Double::compareTo).get();
        Double min = controllerApis.stream().map(api -> api.getAvgRunTime()).min(Double::compareTo).get();
        Double avg = controllerApis.stream().map(api -> api.getAvgRunTime()).collect(Collectors.averagingDouble(Double::doubleValue));
        BigDecimal bg = new BigDecimal(avg);
        avg = bg.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
        systemStatistic.setMaxRunTime(max);
        systemStatistic.setMinRunTime(min);
        systemStatistic.setAvgRunTime(avg);
        return systemStatistic;
    }

    @Override
    public MethodInfo getTree(String methodId) {
        MethodInfo rootInfo = new MethodInfo();
        MethodNode methodNode = methodNodes.get(methodId);
        rootInfo.setId(methodNode.getId());
        rootInfo.setName(methodNode.getName());
        rootInfo.setClassName(methodNode.getClassName());
        rootInfo.setMethodName(methodNode.getMethodName());
        rootInfo.setMethodType(methodNode.getMethodType());
        MethodRelation methodRelation = methodRelations.values().stream().filter(relation -> relation.getTargetId().equals(methodId)).findFirst().get();
        rootInfo.setValue(methodRelation.getAvgRunTime());
        rootInfo.setAvgRunTime(methodRelation.getAvgRunTime());
        rootInfo.setMaxRunTime(methodRelation.getMaxRunTime());
        rootInfo.setMinRunTime(methodRelation.getMinRunTime());
        recursionMethod(rootInfo);
        return rootInfo;
    }

    public void recursionMethod(MethodInfo rootInfo) {
        List<MethodInfo> children = getChildren(rootInfo.getId());
        if (children != null && children.size() > 0) {
            rootInfo.setChildren(children);
            for (MethodInfo child : children) {
                recursionMethod(child);
            }
        }

    }
}
